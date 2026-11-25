import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tarea } from './../../tareas/entities/tarea.entity.js';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relación Uno a Muchos: Un proyecto tiene muchas tareas
  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas: Tarea[];
}
