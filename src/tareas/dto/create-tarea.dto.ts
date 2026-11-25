import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Priority } from './../entities/priority-enum.js';
import { TaskStatus } from '../../proyectos/entities/state-enum.js';

export class CreateTareaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDIENTE })
  @IsEnum(TaskStatus)
  @IsOptional()
  estado?: TaskStatus;

  @ApiProperty({ enum: Priority })
  @IsEnum(Priority)
  prioridad: Priority;

  @ApiProperty({ example: '2026-12-25' })
  @IsDateString()
  fechaLimite: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  proyectoId: string;
}
