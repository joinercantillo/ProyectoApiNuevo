import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import { Proyecto } from './entities/proyecto.entity.js';
import { Tarea } from '../tareas/entities/tarea.entity.js';
import { TaskStatus } from './entities/state-enum.js';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
  ) {}

  private validateDates(fechaInicio: string, fechaFinalizacion: string): void {
    if (fechaFinalizacion < fechaInicio) {
      throw new BadRequestException('La fecha de finalización no puede ser anterior a la fecha de inicio');
    }
  }

  async create(dto: CreateProyectoDto): Promise<Proyecto> {
    this.validateDates(dto.fechaInicio, dto.fechaFinalizacion);
    if (dto.fechaInicio < new Date().toISOString().split('T')[0]) {
      throw new BadRequestException('La fecha de inicio no puede ser anterior a la fecha actual');
    }
    return this.proyectoRepository.save(this.proyectoRepository.create(dto));
  }

  findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.find({ relations: { tareas: true } });
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: { tareas: true },
    });
    if (!proyecto) throw new NotFoundException(`El proyecto con ID ${id} no existe`);
    return proyecto;
  }

  async update(id: string, dto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.findOne(id);
    const fechaInicio = dto.fechaInicio ?? proyecto.fechaInicio;
    const fechaFinalizacion = dto.fechaFinalizacion ?? proyecto.fechaFinalizacion;
    this.validateDates(fechaInicio, fechaFinalizacion);
    Object.assign(proyecto, dto);
    return this.proyectoRepository.save(proyecto);
  }

  async remove(id: string): Promise<void> {
    const proyecto = await this.findOne(id);
    const tareasPendientes = await this.tareaRepository.count({
      where: { proyectoId: id, estado: TaskStatus.PENDIENTE },
    });
    const tareasEnProgreso = await this.tareaRepository.count({
      where: { proyectoId: id, estado: TaskStatus.EN_PROGRESO },
    });
    if (tareasPendientes > 0 || tareasEnProgreso > 0) {
      throw new ConflictException('No se puede eliminar un proyecto con tareas pendientes o en progreso');
    }
    await this.proyectoRepository.remove(proyecto);
  }

  async getProgress(id: string): Promise<{ proyectoId: string; porcentajeAvance: number; totalTareas: number; tareasCompletadas: number }> {
    await this.findOne(id);
    const [totalTareas, tareasCompletadas] = await Promise.all([
      this.tareaRepository.count({ where: { proyectoId: id } }),
      this.tareaRepository.count({ where: { proyectoId: id, estado: TaskStatus.COMPLETADA } }),
    ]);
    const porcentajeAvance = totalTareas === 0 ? 0 : Math.round((tareasCompletadas / totalTareas) * 10000) / 100;
    return { proyectoId: id, porcentajeAvance, totalTareas, tareasCompletadas };
  }
}
