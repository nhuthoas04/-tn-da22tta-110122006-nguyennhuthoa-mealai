import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploaded images as static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Default API responses to UTF-8 JSON. PDF/static responses can still override this later.
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  const allowedOrigins = [
    'http://localhost:3000',
    'https://mealai-two.vercel.app',
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
  ]
    .filter(Boolean)
    .flatMap((v) =>
      // allow CORS_ORIGIN like "a,b" or single string
      String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .map((origin) => origin.replace(/\/+$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS blocked origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'Expires',
    ],
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');


  // Global validation pipe — auto-validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend running on http://localhost:${port}/api/v1`);
}
bootstrap();
