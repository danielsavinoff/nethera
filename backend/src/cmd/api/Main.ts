import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '../../internal/infrastracture/bootstrap/AppModule.js';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

class Main {
  static async bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.use(cookieParser());

    const config = new DocumentBuilder()
      .setTitle('Gamification API')
      .setDescription('The gamefication API description')
      .setVersion('1.0')
      .addTag('gamification')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('openapi', app, documentFactory, {
      useGlobalPrefix: true,
    });

    await app.listen(process.env.BACKEND_PORT ?? 3000);
  }
}

Main.bootstrap();
