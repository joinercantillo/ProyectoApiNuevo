import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { ChangeStatusDto } from './dto/change-status.dto.js';
import { Tarea } from './entities/tarea.entity.js';
import { Proyecto } from '../proyectos/entities/proyecto.entity.js';
import { Priority } from './entities/priority-enum.js';
import { TaskStatus } from '../proyectos/entities/state-enum.js';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository : Repository<Proyecto>,
  ) {}

  private async assertProjectExists(id: string): Promise<void> {
    const exists = await this.proyectoRepository.existsBy({ id });
    if (!exists) throw new NotFoundException(`El proyecto con ID ${id} no existe`);
  }

  async create(dto: CreateTareaDto): Promise<Tarea> {
    await this.assertProjectExists(dto.proyectoId);
    return this.tareaRepository.save(this.tareaRepository.create(dto));
  }

  findAll(estado?: TaskStatus, prioridad?: Priority): Promise<Tarea[]> {
    const where: { estado?: TaskStatus; prioridad?: Priority } = {};
    if (estado) where.estado = estado;
    if (prioridad) where.prioridad = prioridad;
    return this.tareaRepository.find({ where, relations: { proyecto: true } });
  }

  async findOne(id: string): Promise<Tarea> {
    const tarea = await this.tareaRepository.findOne({ where: { id }, relations: { proyecto: true } });
    if (!tarea) throw new NotFoundException(`La tarea con ID ${id} no existe`);
    return tarea;
  }

  async findByProject(proyectoId: string): Promise<Tarea[]> {
    await this.assertProjectExists(proyectoId);
    return this.tareaRepository.find({ where: { proyectoId } });
  }

  async findOverdue(): Promise<Tarea[]> {
    const today = new Date().toISOString().slice(0, 10);
    return this.tareaRepository.find({
      where: {
        fechaLimite: LessThan(today),
        estado: Not(TaskStatus.COMPLETADA),
      },
      relations: { proyecto: true },
    });
  }

  async update(id: string, dto: UpdateTareaDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    if (dto.proyectoId) await this.assertProjectExists(dto.proyectoId);
    Object.assign(tarea, dto);
    return this.tareaRepository.save(tarea);
  }

  async changeStatus(id: string, dto: ChangeStatusDto): Promise<Tarea> {
    const tarea = await this.findOne(id);
    tarea.estado = dto.estado;
    return this.tareaRepository.save(tarea);
  }

  async remove(id: string): Promise<void> {
    const tarea = await this.findOne(id);
    await this.tareaRepository.remove(tarea);
  }
}
