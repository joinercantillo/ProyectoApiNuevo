import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TareasService } from './tareas.service.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { ChangeStatusDto } from './dto/change-status.dto.js';
import { Tarea } from './entities/tarea.entity.js';
import { TaskStatus } from '../proyectos/entities/state-enum.js';
import { Priority } from './entities/priority-enum.js';

@ApiTags('Tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva tarea',
    description: 'Crea una tarea asociada a un proyecto existente.',
  })
  @ApiCreatedResponse({
    description: 'La tarea fue creada exitosamente.',
    type: Tarea,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos (formato de fecha, enum o UUID incorrecto).',
  })
  @ApiNotFoundResponse({
    description: 'El proyecto especificado en proyectoId no existe.',
  })
  create(@Body() dto: CreateTareaDto) {
    return this.tareasService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las tareas',
    description: 'Obtiene el listado de tareas, permitiendo filtrar opcionalmente por estado y prioridad.',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: TaskStatus,
    description: 'Filtrar tareas por su estado actual',
  })
  @ApiQuery({
    name: 'prioridad',
    required: false,
    enum: Priority,
    description: 'Filtrar tareas por su nivel de prioridad',
  })
  @ApiOkResponse({
    description: 'Listado de tareas obtenido exitosamente.',
    type: [Tarea],
  })
  findAll(
    @Query('estado') estado?: TaskStatus,
    @Query('prioridad') prioridad?: Priority,
  ) {
    return this.tareasService.findAll(estado, prioridad);
  }

  @Get('vencidas')
  @ApiOperation({
    summary: 'Listar tareas vencidas',
    description: 'Retorna todas las tareas cuya fecha límite ya pasó y que aún no están completadas.',
  })
  @ApiOkResponse({
    description: 'Listado de tareas vencidas obtenido exitosamente.',
    type: [Tarea],
  })
  findOverdue() {
    return this.tareasService.findOverdue();
  }

  @Get('proyecto/:proyectoId')
  @ApiOperation({
    summary: 'Listar tareas por proyecto',
    description: 'Obtiene todas las tareas asociadas a un proyecto específico.',
  })
  @ApiParam({
    name: 'proyectoId',
    description: 'Identificador UUID del proyecto',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiOkResponse({
    description: 'Tareas del proyecto obtenidas exitosamente.',
    type: [Tarea],
  })
  @ApiBadRequestResponse({
    description: 'El proyectoId proporcionado no tiene formato UUID válido.',
  })
  @ApiNotFoundResponse({
    description: 'El proyecto con el ID especificado no existe.',
  })
  findByProject(@Param('proyectoId', ParseUUIDPipe) proyectoId: string) {
    return this.tareasService.findByProject(proyectoId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una tarea por su ID',
    description: 'Busca y retorna una tarea específica junto con la información de su proyecto asociado.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la tarea',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Tarea encontrada exitosamente.',
    type: Tarea,
  })
  @ApiBadRequestResponse({
    description: 'El ID proporcionado no tiene formato UUID válido.',
  })
  @ApiNotFoundResponse({
    description: 'La tarea con el ID especificado no existe.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tareasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea',
    description: 'Actualiza parcialmente los datos de una tarea existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la tarea a actualizar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Tarea actualizada exitosamente.',
    type: Tarea,
  })
  @ApiBadRequestResponse({
    description: 'El ID o los datos enviados en el cuerpo son inválidos.',
  })
  @ApiNotFoundResponse({
    description: 'La tarea o el nuevo proyecto asociado no existe.',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTareaDto) {
    return this.tareasService.update(id, dto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Cambiar el estado de una tarea',
    description: 'Actualiza únicamente el estado de ejecución de una tarea (pendiente, en_progreso, completada).',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la tarea',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Estado de la tarea actualizado exitosamente.',
    type: Tarea,
  })
  @ApiBadRequestResponse({
    description: 'El ID o el estado proporcionado es inválido.',
  })
  @ApiNotFoundResponse({
    description: 'La tarea con el ID especificado no existe.',
  })
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ChangeStatusDto) {
    return this.tareasService.changeStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tarea',
    description: 'Elimina permanentemente una tarea por su identificador UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la tarea a eliminar',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Tarea eliminada exitosamente.',
  })
  @ApiBadRequestResponse({
    description: 'El ID proporcionado no tiene formato UUID válido.',
  })
  @ApiNotFoundResponse({
    description: 'La tarea con el ID especificado no existe.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tareasService.remove(id);
  }
}
