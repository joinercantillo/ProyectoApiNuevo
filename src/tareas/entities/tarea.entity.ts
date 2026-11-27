import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Proyecto } from './../../proyectos/entities/proyecto.entity.js';
import { Priority } from './priority-enum.js';
import { TaskStatus } from '../../proyectos/entities/state-enum.js';

@Entity('tareas')
export class Tarea {
  @ApiProperty({
    description: 'Identificador único de la tarea en formato UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Título corto y descriptivo de la tarea',
    example: 'Implementar pruebas unitarias en NestJS',
  })
  @Column()
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada de las actividades a realizar en la tarea',
    example: 'Cubrir todos los métodos de ProyectosService y TareasService usando Vitest',
  })
  @Column()
  descripcion: string;

  @ApiProperty({
    description: 'Estado actual de ejecución de la tarea',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    default: TaskStatus.PENDIENTE,
    example: TaskStatus.PENDIENTE,
  })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDIENTE })
  estado: TaskStatus;

  @ApiProperty({
    description: 'Nivel de urgencia o importancia de la tarea',
    enum: Priority,
    enumName: 'Priority',
    example: Priority.ALTA,
  })
  @Column({ type: 'enum', enum: Priority })
  prioridad: Priority;

  @ApiProperty({
    description: 'Fecha límite de entrega de la tarea en formato YYYY-MM-DD',
    example: '2026-12-15',
    format: 'date',
  })
  @Column({ type: 'date', name: 'fecha_limite' })
  fechaLimite: string;

  @ApiProperty({
    description: 'Identificador UUID del proyecto al que pertenece la tarea',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ApiProperty({
    description: 'Proyecto asociado al que pertenece esta tarea',
    type: () => Proyecto,
  })
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Relation<Proyecto>;
}
