import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoTarea } from '../entities/estado-tarea.enum.js';

export class CambiarEstadoTareaDto {
  @ApiProperty({ enum: EstadoTarea, example: EstadoTarea.COMPLETADA })
  @IsEnum(EstadoTarea)
  estado: EstadoTarea;
}
