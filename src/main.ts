import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Driven Pass API')
    .setDescription(
      'The documentation of the Driven Pass API, a password manager application made using Nest.js.',
    )
    .setVersion('1.0')
    .addTag('Driven Pass')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log('Server is up and running on port: ' + port);
  });
}
bootstrap();
