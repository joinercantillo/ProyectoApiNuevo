import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessThan, Not } from 'typeorm';
import { TareasService } from './tareas.service.js';
import { Tarea } from './entities/tarea.entity.js';
import { Proyecto } from '../proyectos/entities/proyecto.entity.js';
import { Priority } from './entities/priority-enum.js';
import { TaskStatus } from '../proyectos/entities/state-enum.js';

describe('TareasService', () => {
  let service: TareasService;

  const mockTareaRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  const mockProyectoRepository = {
    existsBy: vi.fn(),
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-26T12:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        {
          provide: getRepositoryToken(Tarea),
          useValue: mockTareaRepository,
        },
        {
          provide: getRepositoryToken(Proyecto),
          useValue: mockProyectoRepository,
        },
      ],
    }).compile();

    service = module.get<TareasService>(TareasService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('create', () => {
    it('debe crear y retornar una tarea si el proyecto existe', async () => {
      const dto = {
        titulo: 'Implementar tests',
        descripcion: 'Pruebas unitarias',
        prioridad: Priority.ALTA,
        fechaLimite: '2026-12-01',
        proyectoId: 'proj-1',
      };
      const createdTarea = { id: 'tarea-1', ...dto, estado: TaskStatus.PENDIENTE };

      mockProyectoRepository.existsBy.mockResolvedValue(true);
      mockTareaRepository.create.mockReturnValue(createdTarea);
      mockTareaRepository.save.mockResolvedValue(createdTarea);

      const result = await service.create(dto as any);

      expect(result).toEqual(createdTarea);
      expect(mockProyectoRepository.existsBy).toHaveBeenCalledWith({ id: 'proj-1' });
      expect(mockTareaRepository.create).toHaveBeenCalledWith(dto);
      expect(mockTareaRepository.save).toHaveBeenCalledWith(createdTarea);
    });

    it('debe lanzar NotFoundException si el proyecto asociado no existe', async () => {
      mockProyectoRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.create({ titulo: 'Test', proyectoId: 'proj-inexistente' } as any),
      ).rejects.toThrow(NotFoundException);

      expect(mockTareaRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las tareas sin filtros', async () => {
      const tareas = [{ id: 'tarea-1', titulo: 'T1' }];
      mockTareaRepository.find.mockResolvedValue(tareas);

      const result = await service.findAll();

      expect(result).toEqual(tareas);
      expect(mockTareaRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: { proyecto: true },
      });
    });

    it('debe filtrar tareas por estado y prioridad cuando se envían', async () => {
      const tareas = [{ id: 'tarea-1', estado: TaskStatus.EN_PROGRESO, prioridad: Priority.ALTA }];
      mockTareaRepository.find.mockResolvedValue(tareas);

      const result = await service.findAll(TaskStatus.EN_PROGRESO, Priority.ALTA);

      expect(result).toEqual(tareas);
      expect(mockTareaRepository.find).toHaveBeenCalledWith({
        where: { estado: TaskStatus.EN_PROGRESO, prioridad: Priority.ALTA },
        relations: { proyecto: true },
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una tarea por su ID', async () => {
      const tarea = { id: 'tarea-1', titulo: 'T1' };
      mockTareaRepository.findOne.mockResolvedValue(tarea);

      const result = await service.findOne('tarea-1');

      expect(result).toEqual(tarea);
      expect(mockTareaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'tarea-1' },
        relations: { proyecto: true },
      });
    });

    it('debe lanzar NotFoundException si la tarea no existe', async () => {
      mockTareaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('tarea-no')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByProject', () => {
    it('debe retornar las tareas de un proyecto existente', async () => {
      const tareas = [{ id: 'tarea-1', proyectoId: 'proj-1' }];
      mockProyectoRepository.existsBy.mockResolvedValue(true);
      mockTareaRepository.find.mockResolvedValue(tareas);

      const result = await service.findByProject('proj-1');

      expect(result).toEqual(tareas);
      expect(mockProyectoRepository.existsBy).toHaveBeenCalledWith({ id: 'proj-1' });
      expect(mockTareaRepository.find).toHaveBeenCalledWith({ where: { proyectoId: 'proj-1' } });
    });

    it('debe lanzar NotFoundException si el proyecto no existe', async () => {
      mockProyectoRepository.existsBy.mockResolvedValue(false);

      await expect(service.findByProject('proj-no')).rejects.toThrow(NotFoundException);
      expect(mockTareaRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('findOverdue', () => {
    it('debe retornar las tareas con fechaLimite menor a hoy y que no estén completadas', async () => {
      const overdueTasks = [{ id: 'tarea-vencida', fechaLimite: '2026-11-20' }];
      mockTareaRepository.find.mockResolvedValue(overdueTasks);

      const result = await service.findOverdue();

      expect(result).toEqual(overdueTasks);
      expect(mockTareaRepository.find).toHaveBeenCalledWith({
        where: {
          fechaLimite: LessThan('2026-11-26'),
          estado: Not(TaskStatus.COMPLETADA),
        },
        relations: { proyecto: true },
      });
    });
  });

  describe('update', () => {
    it('debe actualizar la tarea sin validar proyecto si no se envía proyectoId', async () => {
      const existing = { id: 'tarea-1', titulo: 'Viejo', proyectoId: 'proj-1' };
      const dto = { titulo: 'Nuevo' };
      const updated = { ...existing, ...dto };

      mockTareaRepository.findOne.mockResolvedValue(existing);
      mockTareaRepository.save.mockResolvedValue(updated);

      const result = await service.update('tarea-1', dto);

      expect(result).toEqual(updated);
      expect(mockProyectoRepository.existsBy).not.toHaveBeenCalled();
      expect(mockTareaRepository.save).toHaveBeenCalledWith(updated);
    });

    it('debe validar que el nuevo proyecto exista cuando se envía proyectoId en el DTO', async () => {
      const existing = { id: 'tarea-1', titulo: 'Viejo', proyectoId: 'proj-1' };
      const dto = { proyectoId: 'proj-2' };
      const updated = { ...existing, ...dto };

      mockTareaRepository.findOne.mockResolvedValue(existing);
      mockProyectoRepository.existsBy.mockResolvedValue(true);
      mockTareaRepository.save.mockResolvedValue(updated);

      const result = await service.update('tarea-1', dto);

      expect(result).toEqual(updated);
      expect(mockProyectoRepository.existsBy).toHaveBeenCalledWith({ id: 'proj-2' });
      expect(mockTareaRepository.save).toHaveBeenCalledWith(updated);
    });

    it('debe lanzar NotFoundException si el nuevo proyectoId no existe', async () => {
      mockTareaRepository.findOne.mockResolvedValue({ id: 'tarea-1' });
      mockProyectoRepository.existsBy.mockResolvedValue(false);

      await expect(
        service.update('tarea-1', { proyectoId: 'proj-inexistente' }),
      ).rejects.toThrow(NotFoundException);

      expect(mockTareaRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('changeStatus', () => {
    it('debe actualizar el estado de la tarea y guardarla', async () => {
      const existing = { id: 'tarea-1', estado: TaskStatus.PENDIENTE };
      const updated = { id: 'tarea-1', estado: TaskStatus.COMPLETADA };

      mockTareaRepository.findOne.mockResolvedValue(existing);
      mockTareaRepository.save.mockResolvedValue(updated);

      const result = await service.changeStatus('tarea-1', { estado: TaskStatus.COMPLETADA });

      expect(result).toEqual(updated);
      expect(mockTareaRepository.save).toHaveBeenCalledWith(updated);
    });

    it('debe lanzar NotFoundException si la tarea no existe', async () => {
      mockTareaRepository.findOne.mockResolvedValue(null);

      await expect(
        service.changeStatus('tarea-no', { estado: TaskStatus.COMPLETADA }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar la tarea si existe', async () => {
      const existing = { id: 'tarea-1', titulo: 'T1' };
      mockTareaRepository.findOne.mockResolvedValue(existing);
      mockTareaRepository.remove.mockResolvedValue(undefined);

      await service.remove('tarea-1');

      expect(mockTareaRepository.remove).toHaveBeenCalledWith(existing);
    });
  });
});
