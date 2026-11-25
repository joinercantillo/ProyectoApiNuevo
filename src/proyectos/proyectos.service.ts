import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import { Proyecto } from './entities/proyecto.entity.js';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const nuevoProyecto = this.proyectoRepository.create(createProyectoDto);
    return await this.proyectoRepository.save(nuevoProyecto);
  }

async findAll(): Promise<Proyecto[]> {
  return await this.proyectoRepository.find();
}

async findOne(id: string): Promise<Proyecto> {
  const proyecto = await this.proyectoRepository.findOneBy({ id });

  if (!proyecto) {
    throw new NotFoundException(`El proyecto con ID ${id} no existe`);
  }

  return proyecto;
}


  async update(id: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.preload({
      id,
      ...updateProyectoDto,
    });

    if (!proyecto) {
      throw new NotFoundException(`El proyecto con ID ${id} no existe`);
    }

    return await this.proyectoRepository.save(proyecto);
  }

  async remove(id: string): Promise<void> {
    const proyecto = await this.findOne(id);
    await this.proyectoRepository.remove(proyecto);
  }
}
