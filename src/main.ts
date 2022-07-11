import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  const config = new DocumentBuilder()
    .setTitle('Cleaning schedule')
    .setDescription('The Task API description')
    .setVersion('1.0')
    .addTag('Task')
    .addTag('Cleaning Session Optimizer')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs/api', app, document, {
    swaggerOptions: {
      supportedSubmitMethods: [],
    },
  });

  await app.listen(3000);
}
bootstrap();
