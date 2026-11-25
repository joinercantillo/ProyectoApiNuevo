import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Proyecto } from './../../proyectos/entities/proyecto.entity.js';
import { Priority } from './priority-enum.js';
import { TaskStatus } from '../../proyectos/entities/state-enum.js';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDIENTE })
  estado: TaskStatus;

  @Column({ type: 'enum', enum: Priority })
  prioridad: Priority;

  @Column({ type: 'date', name: 'fecha_limite' })
  fechaLimite: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Relation<Proyecto>;
}
