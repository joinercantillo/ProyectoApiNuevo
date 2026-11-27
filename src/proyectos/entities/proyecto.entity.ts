import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tarea } from './../../tareas/entities/tarea.entity.js';

@Entity('proyectos')
export class Proyecto {
  @ApiProperty({
    description: 'Identificador único del proyecto en formato UUID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del proyecto',
    example: 'API de Gestión de Proyectos y Tareas',
  })
  @Column()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción general del alcance y objetivos del proyecto',
    example: 'Backend desarrollado en NestJS con TypeORM, PostgreSQL y pruebas en Vitest',
    nullable: true,
  })
  @Column({ nullable: true })
  descripcion: string;

  @ApiProperty({
    description: 'Fecha de inicio del proyecto en formato YYYY-MM-DD',
    example: '2026-11-27',
    format: 'date',
  })
  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha estimada de finalización del proyecto en formato YYYY-MM-DD',
    example: '2026-12-25',
    format: 'date',
  })
  @Column({ type: 'date', name: 'fecha_finalizacion' })
  fechaFinalizacion: string;

  // Relación Uno a Muchos: Un proyecto tiene muchas tareas
  @ApiProperty({
    description: 'Listado de tareas asociadas al proyecto',
    type: () => [Tarea],
  })
  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas: Tarea[];
}
