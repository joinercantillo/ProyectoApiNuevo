import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosController } from './proyectos/proyectos.controller.js';
import { ProyectosService } from './proyectos/proyectos.service.js';
import { TareasController } from './tareas/tareas.controller.js';
import { TareasService } from './tareas/tareas.service.js';

@Module({
  controllers: [ProyectosController, TareasController],
  providers: [
    { provide: ProyectosService, useValue: {} },
    { provide: TareasService, useValue: {} },
  ],
})
class DocumentacionModule {}

describe('Documentación Swagger', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DocumentacionModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('documenta los endpoints principales', () => {
    const documento = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('API de proyectos y tareas')
        .setVersion('1.0')
        .build(),
    );

    expect(Object.keys(documento.paths)).toEqual(
      expect.arrayContaining([
        '/proyectos',
        '/proyectos/{id}/progreso',
        '/tareas/proyecto/{proyectoId}',
        '/tareas',
        '/tareas/vencidas',
        '/tareas/{id}/estado',
      ]),
    );
  });
});
