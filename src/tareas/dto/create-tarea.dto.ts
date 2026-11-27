import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Priority } from './../entities/priority-enum.js';
import { TaskStatus } from '../../proyectos/entities/state-enum.js';

export class CreateTareaDto {
  @ApiProperty({
    description: 'Título corto y descriptivo de la tarea',
    example: 'Implementar pruebas unitarias en NestJS',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada de las actividades a realizar en la tarea',
    example: 'Cubrir todos los métodos de ProyectosService y TareasService usando Vitest',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Estado inicial de la tarea (por defecto es pendiente)',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    default: TaskStatus.PENDIENTE,
    example: TaskStatus.PENDIENTE,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  estado?: TaskStatus;

  @ApiProperty({
    description: 'Nivel de urgencia o prioridad de la tarea',
    enum: Priority,
    enumName: 'Priority',
    example: Priority.ALTA,
  })
  @IsEnum(Priority)
  prioridad: Priority;

  @ApiProperty({
    description: 'Fecha límite de entrega de la tarea en formato YYYY-MM-DD',
    example: '2026-12-25',
    format: 'date',
  })
  @IsDateString()
  fechaLimite: string;

  @ApiProperty({
    description: 'Identificador UUID del proyecto al que pertenece la tarea',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsUUID()
  proyectoId: string;
}
