import { Body, Controller, Post, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response, // Để set cookie
  ) {
    // 1. Gọi Service để lấy cặp token
    const tokens = await this.authService.login(loginDto.email, loginDto.password);

    // 2. Set Refresh Token vào HttpOnly Cookie
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, // Quan trọng: JS không đọc được
      secure: false, // Set 'true' nếu bạn chạy https (Production)
      path: '/',
      sameSite: 'strict', // Chống tấn công CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (tính bằng mili giây)
    });

    // 3. Trả về Access Token cho Client
    return {
      accessToken: tokens.accessToken,
    };
  }
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 1. Lấy Refresh Token từ Cookie
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy Refresh Token');
    }

    // 2. Gọi Service xử lý
    const tokens = await this.authService.refreshTokens(refreshToken);

    // 3. Cập nhật lại Refresh Token mới vào Cookie (Gia hạn thời gian)
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // nhớ để true khi lên production
      path: '/',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 4. Trả về Access Token mới
    return {
      accessToken: tokens.accessToken,
    };
  }
}