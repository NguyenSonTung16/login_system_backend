import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser'; // <--- 1. BỔ SUNG IMPORT NÀY

// Bootstrap app - Entry point
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Kích hoạt Cookie Parser (Để đọc được Refresh Token từ cookie)
  app.use(cookieParser()); // <--- 2. BỔ SUNG DÒNG NÀY (Đặt trước CORS hoặc Validation)

  const frontendOrigin = configService.get<string>('FRONTEND_ORIGIN') || 'http://localhost:3001';
  
  app.enableCors({
    origin: frontendOrigin, // Đảm bảo React của bạn chạy đúng port này nhé
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép gửi/nhận cookie
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Backend đang chạy tại: http://localhost:${port}`);
}
bootstrap();