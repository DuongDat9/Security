import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ===================== Yêu cầu 1: Cookies =====================
  // Áp dụng cookie-parser middleware để đọc/ghi cookie (req.cookies, res.cookie)
  app.use(cookieParser());

  // ===================== Yêu cầu 2: Session =====================
  // Áp dụng express-session middleware để lưu thông tin theo phiên làm việc
  app.use(
    session({
      secret:
        process.env.SESSION_SECRET ||
        'my-very-secret-session-key-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 },
    }),
  );

  // Bật validate DTO toàn cục dựa trên class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
