import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoTarea } from '../entities/estado-tarea.enum.js';
import { Prioridad } from '../entities/prioridad.enum.js';

export class FiltrarTareasDto {
  @ApiPropertyOptional({ enum: EstadoTarea, example: EstadoTarea.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;

  @ApiPropertyOptional({ enum: Prioridad, example: Prioridad.ALTA })
  @IsOptional()
  @IsEnum(Prioridad)
  prioridad?: Prioridad;
}
