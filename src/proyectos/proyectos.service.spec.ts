import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectosService } from './proyectos.service.js';
import { Proyecto } from './entities/proyecto.entity.js';
import { Tarea } from '../tareas/entities/tarea.entity.js';

describe('ProyectosService', () => {
  let service: ProyectosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosService,
        { provide: getRepositoryToken(Proyecto), useValue: {} },
        { provide: getRepositoryToken(Tarea), useValue: {} },
      ],
    }).compile();

    service = module.get<ProyectosService>(ProyectosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
