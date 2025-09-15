const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/apps/backend/src/app.module');

let cachedApp;

module.exports = async (req, res) => {
  try {
    if (!cachedApp) {
      const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ['error', 'warn'],
      });

      // API prefix 설정
      app.setGlobalPrefix('api/v1');

      await app.init();
      cachedApp = app.getHttpAdapter().getInstance();
    }

    return cachedApp(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};
