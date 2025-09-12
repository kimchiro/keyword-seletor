import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 보안 미들웨어
  app.use(helmet());
  app.use(compression());

  // CORS 설정
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 글로벌 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API 프리픽스
  app.setGlobalPrefix('api/v1');

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('키워드 리서치 API')
    .setDescription('네이버 블로그 키워드 리서치 서비스 API')
    .setVersion('0.1.0')
    .addTag('keywords', '키워드 관련 API')
    .addTag('reports', '리포트 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 백엔드 서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`📚 API 문서: http://localhost:${port}/api/docs`);
}

bootstrap();
