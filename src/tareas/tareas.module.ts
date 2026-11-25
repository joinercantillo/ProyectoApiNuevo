import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service.js';
import { TareasController } from './tareas.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity.js';
import { Tarea } from './entities/tarea.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Proyecto])],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
