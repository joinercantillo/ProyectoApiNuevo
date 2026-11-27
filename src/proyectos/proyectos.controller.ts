import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service.js';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';
import { Proyecto } from './entities/proyecto.entity.js';

@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo proyecto',
    description: 'Registra un proyecto validando que la fecha de inicio no sea pasada y que la finalización sea posterior o igual al inicio.',
  })
  @ApiCreatedResponse({
    description: 'El proyecto fue creado exitosamente.',
    type: Proyecto,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o regla de fechas incumplida (fecha de inicio pasada o finalización anterior al inicio).',
  })
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los proyectos',
    description: 'Obtiene todos los proyectos registrados junto con sus tareas asociadas.',
  })
  @ApiOkResponse({
    description: 'Listado de proyectos obtenido exitosamente.',
    type: [Proyecto],
  })
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get(':id/progreso')
  @ApiOperation({
    summary: 'Obtener el progreso de un proyecto',
    description: 'Calcula el porcentaje de avance del proyecto con base en el total de tareas y las tareas completadas.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del proyecto',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({
    description: 'Progreso del proyecto calculado exitosamente.',
    schema: {
      type: 'object',
      properties: {
        proyectoId: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
        porcentajeAvance: { type: 'number', example: 66.67 },
        totalTareas: { type: 'number', example: 3 },
        tareasCompletadas: { type: 'number', example: 2 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'El ID proporcionado no tiene formato UUID válido.',
  })
  @ApiNotFoundResponse({
    description: 'El proyecto con el ID especificado no existe.',
  })
  getProgress(@Param('id', ParseUUIDPipe) id: string) {
    return this.proyectosService.getProgress(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un proyecto por su ID',
    description: 'Busca y retorna un proyecto específico junto con todas sus tareas asociadas.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del proyecto',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({
    description: 'Proyecto encontrado exitosamente.',
    type: Proyecto,
  })
  @ApiBadRequestResponse({
    description: 'El ID proporcionado no tiene formato UUID válido.',
  })
  @ApiNotFoundResponse({
    description: 'El proyecto con el ID especificado no existe.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.proyectosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un proyecto',
    description: 'Actualiza parcialmente los datos de un proyecto existente validando la coherencia de sus fechas.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del proyecto a actualizar',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({
    description: 'Proyecto actualizado exitosamente.',
    type: Proyecto,
  })
  @ApiBadRequestResponse({
    description: 'El ID es inválido o la fecha de finalización resulta anterior a la fecha de inicio.',
  })
  @ApiNotFoundResponse({
    description: 'El proyecto con el ID especificado no existe.',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectosService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un proyecto',
    description: 'Elimina un proyecto únicamente si no tiene tareas pendientes ni en progreso.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del proyecto a eliminar',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({
    description: 'Proyecto eliminado exitosamente.',
  })
  @ApiBadRequestResponse({
    description: 'El ID proporcionado no tiene formato UUID válido.',
  })
  @ApiNotFoundResponse({
    description: 'El proyecto con el ID especificado no existe.',
  })
  @ApiConflictResponse({
    description: 'No se puede eliminar el proyecto porque tiene tareas pendientes o en progreso.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.proyectosService.remove(id);
  }
}
