import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tarea } from './../../tareas/entities/tarea.entity.js';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: string;

  @Column({ type: 'date', name: 'fecha_finalizacion' })
  fechaFinalizacion: string;

  // Relación Uno a Muchos: Un proyecto tiene muchas tareas
  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas: Tarea[];
}
