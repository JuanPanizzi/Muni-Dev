import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: 'http://localhost:5173/', // Origen permitido
  //   methods: ['GET', 'POST'], // Métodos permitidos
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
  // });

  const corsOptions: CorsOptions = {
    origin: 'https://municipalidad-client.vercel.app/',
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true, // Permite enviar cookies y headers de autenticación
  };

  app.enableCors(corsOptions);
  
  await app.listen(3000);
}
bootstrap();
