import { ApiProperty } from '@nestjs/swagger';

export class ProgresoProyectoDto {
  @ApiProperty({ format: 'uuid' })
  proyectoId: string;

  @ApiProperty({
    description: 'Cantidad total de tareas del proyecto',
    example: 10,
  })
  totalTareas: number;

  @ApiProperty({ description: 'Cantidad de tareas completadas', example: 4 })
  tareasCompletadas: number;

  @ApiProperty({
    description: 'Porcentaje de avance del proyecto',
    example: 40,
    minimum: 0,
    maximum: 100,
  })
  porcentajeAvance: number;
}
