import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from './../../proyectos/entities/proyecto.entity.js';
import { priority } from './priority-enum.js';
import type { Relation } from 'typeorm';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'enum', enum: priority })
  prioridad: priority;

  // 👇 Columna y relación con Proyecto
  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Relation<Proyecto>;
}
