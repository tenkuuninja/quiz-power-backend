import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const httpAdapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.enableCors();
  // app.useGlobalPipes(new ValidationPipe());
  // app.useWebSocketAdapter(new SocketIoAdapter(app));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('QuizPower API')
    .addBearerAuth()
    .addApiKey({ name: 'Authorization' } as SecuritySchemeObject)
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 4001);
}
bootstrap();
