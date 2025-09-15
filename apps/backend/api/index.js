const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const compression = require('compression');
const helmet = require('helmet');

let app;

async function createApp() {
  const { AppModule } = await import('../dist/app.module.js');

  const nestApp = await NestFactory.create(AppModule);

  // 보안 미들웨어
  nestApp.use(helmet());
  nestApp.use(compression());

  // CORS 설정
  nestApp.enableCors({
    origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // 글로벌 파이프 설정
  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // API 프리픽스
  nestApp.setGlobalPrefix('api/v1');

  // Swagger 설정 (프로덕션에서는 비활성화)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('키워드 리서치 API')
      .setDescription('네이버 블로그 키워드 리서치 서비스 API')
      .setVersion('0.1.0')
      .addTag('keywords', '키워드 관련 API')
      .addTag('reports', '리포트 관련 API')
      .build();

    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api/docs', nestApp, document);
  }

  await nestApp.init();
  return nestApp;
}

module.exports = async (req, res) => {
  if (!app) {
    app = await createApp();
  }

  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
