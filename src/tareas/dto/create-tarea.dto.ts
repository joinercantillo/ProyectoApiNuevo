import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { priority } from './../entities/priority-enum.js'; // Ajusta tu ruta

export class CreateTareaDto {
  @IsString()
  nombre: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional() // Opcional si por defecto inicia en false
  completed?: boolean;

  @IsDateString()
  startedAt: string;

  @IsEnum(priority)
  prioridad: priority;

  // 👇 Así llamas la relación con Proyecto (usando UUID porque tu id es string)
  @IsUUID()
  proyectoId: string;
}
