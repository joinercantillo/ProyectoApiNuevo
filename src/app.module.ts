import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProyectosModule } from './proyectos/proyectos.module.js';
import { TareasModule } from './tareas/tareas.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ConfigModule.forRoot({
      isGlobal: true, // Hace que process.env esté disponible en toda la app
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const required = (key: string): string => {
          const value = configService.get<string>(key);
          if (!value) throw new Error(`La variable de entorno ${key} es requerida`);
          return value;
        };

        return {
          type: required('DB_TYPE') as 'postgres',
          host: required('DB_HOST'),
          port: Number(required('DB_PORT')),
          username: required('DB_USERNAME'),
          password: required('DB_PASSWORD'),
          database: required('DB_NAME'),
          autoLoadEntities: true,
          synchronize: required('DB_SYNCHRONIZE') === 'true',
          ssl: required('DB_SSL') === 'true'
            ? { rejectUnauthorized: required('DB_SSL_REJECT_UNAUTHORIZED') === 'true' }
            : false,
        };
      },
    }),
    ProyectosModule,
    TareasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
