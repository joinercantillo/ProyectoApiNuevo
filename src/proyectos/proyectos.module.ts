import { Module } from '@nestjs/common';
import { ProyectosService } from './proyectos.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosController } from './proyectos.controller.js';
import { Proyecto } from './entities/proyecto.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}
