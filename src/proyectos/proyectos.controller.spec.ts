import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosController } from './proyectos.controller.js';
import { ProyectosService } from './proyectos.service.js';
import { CreateProyectoDto } from './dto/create-proyecto.dto.js';
import { UpdateProyectoDto } from './dto/update-proyecto.dto.js';

describe('ProyectosController', () => {
  let controller: ProyectosController;

  const mockProyectosService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getProgress: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectosController],
      providers: [
        {
          provide: ProyectosService,
          useValue: mockProyectosService,
        },
      ],
    }).compile();

    controller = module.get<ProyectosController>(ProyectosController);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe llamar a service.create con el DTO y retornar el proyecto creado', async () => {
    const dto: CreateProyectoDto = {
      nombre: 'Proyecto Test',
      descripcion: 'Descripción',
      fechaInicio: '2026-11-27',
      fechaFinalizacion: '2026-12-20',
    };
    const expectedResult = { id: 'uuid-1', ...dto, tareas: [] };
    mockProyectosService.create.mockResolvedValue(expectedResult);

    const result = await controller.create(dto);

    expect(result).toEqual(expectedResult);
    expect(mockProyectosService.create).toHaveBeenCalledWith(dto);
  });

  it('debe llamar a service.findAll y retornar la lista de proyectos', async () => {
    const expectedResult = [{ id: 'uuid-1', nombre: 'Proyecto 1', tareas: [] }];
    mockProyectosService.findAll.mockResolvedValue(expectedResult);

    const result = await controller.findAll();

    expect(result).toEqual(expectedResult);
    expect(mockProyectosService.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe llamar a service.findOne con el ID y retornar un proyecto', async () => {
    const expectedResult = { id: 'uuid-1', nombre: 'Proyecto 1', tareas: [] };
    mockProyectosService.findOne.mockResolvedValue(expectedResult);

    const result = await controller.findOne('uuid-1');

    expect(result).toEqual(expectedResult);
    expect(mockProyectosService.findOne).toHaveBeenCalledWith('uuid-1');
  });

  it('debe llamar a service.update con el ID y el DTO y retornar el proyecto actualizado', async () => {
    const dto: UpdateProyectoDto = { nombre: 'Nombre Actualizado' };
    const expectedResult = { id: 'uuid-1', nombre: 'Nombre Actualizado' };
    mockProyectosService.update.mockResolvedValue(expectedResult);

    const result = await controller.update('uuid-1', dto);

    expect(result).toEqual(expectedResult);
    expect(mockProyectosService.update).toHaveBeenCalledWith('uuid-1', dto);
  });

  it('debe llamar a service.remove con el ID', async () => {
    mockProyectosService.remove.mockResolvedValue(undefined);

    await controller.remove('uuid-1');

    expect(mockProyectosService.remove).toHaveBeenCalledWith('uuid-1');
  });

  it('debe llamar a service.getProgress con el ID y retornar el avance', async () => {
    const expectedProgress = {
      proyectoId: 'uuid-1',
      porcentajeAvance: 50,
      totalTareas: 2,
      tareasCompletadas: 1,
    };
    mockProyectosService.getProgress.mockResolvedValue(expectedProgress);

    const result = await controller.getProgress('uuid-1');

    expect(result).toEqual(expectedProgress);
    expect(mockProyectosService.getProgress).toHaveBeenCalledWith('uuid-1');
  });
});
