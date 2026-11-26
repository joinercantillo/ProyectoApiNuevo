import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateProyectoDto } from './create-proyecto.dto.js';
import { FechaPosteriorA } from './../../common/validators/fecha-posterior-a.validator.js';


describe('CreateProyectoDto', () => {
  it('acepta un rango de fechas válido', async () => {
    const dto = plainToInstance(CreateProyectoDto, {
      nombre: 'Sistema de ventas',
      descripcion: 'Proyecto de prueba',
      fechaInicio: '2026-01-01',
      fechaFinalizacion: '2026-06-30',
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rechaza una fecha de finalización anterior a la de inicio', async () => {
    const dto = plainToInstance(CreateProyectoDto, {
      nombre: 'Sistema de ventas',
      fechaInicio: '2026-06-30',
      fechaFinalizacion: '2026-01-01',
    });

    const errores = await validate(dto);

    expect(
      errores.some((error) => error.property === 'fechaFinalizacion'),
    ).toBe(true);
  });
});
