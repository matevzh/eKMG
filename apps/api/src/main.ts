import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Railway (and most reverse proxies) set X-Forwarded-For — needed so
  // ThrottlerGuard rate-limits by real client IP, not the proxy hop.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: false,
  }));

  // Log every request and response
  app.use((req, res, next) => {
    logger.log(`${req.ip} ${req.method} ${req.url}`);
    res.on('finish', () => {
      logger.log(`${req.ip} ${req.method} ${req.url} ${res.statusCode}`);
    });
    next();
  });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
