import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FechaPosteriorA } from '../../common/validators/fecha-posterior-a.validator.js';

export class CreateProyectoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: '2026-11-25' })
  @IsDateString()
  
  fechaInicio: string;

  @ApiProperty({ example: '2026-12-25' })
  @IsDateString()
  @FechaPosteriorA('fechaInicio')
  fechaFinalizacion: string;
  
}
