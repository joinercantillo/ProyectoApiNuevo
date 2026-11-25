import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TareasService } from './tareas.service.js';
import { CreateTareaDto } from './dto/create-tarea.dto.js';
import { UpdateTareaDto } from './dto/update-tarea.dto.js';
import { ChangeStatusDto } from './dto/change-status.dto.js';
import { TaskStatus } from '../proyectos/entities/state-enum.js';
import { Priority } from './entities/priority-enum.js';

@ApiTags('Tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Body() dto: CreateTareaDto) {
    return this.tareasService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'estado', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'prioridad', required: false, enum: Priority })
  findAll(
    @Query('estado') estado?: TaskStatus,
    @Query('prioridad') prioridad?: Priority,
  ) {
    return this.tareasService.findAll(estado, prioridad);
  }

  @Get('vencidas')
  findOverdue() {
    return this.tareasService.findOverdue();
  }

  @Get('proyecto/:proyectoId')
  findByProject(@Param('proyectoId', ParseUUIDPipe) proyectoId: string) {
    return this.tareasService.findByProject(proyectoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tareasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTareaDto) {
    return this.tareasService.update(id, dto);
  }

  @Patch(':id/estado')
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ChangeStatusDto) {
    return this.tareasService.changeStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tareasService.remove(id);
  }
}
