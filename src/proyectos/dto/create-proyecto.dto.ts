import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  description?: string;
}
