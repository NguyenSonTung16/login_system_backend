import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  // TẠO cặp token 
  async signTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      // Tạo Access Token
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),       
        expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m') as any, 
      }),
      
      // Tạo Refresh Token
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Xử lý login
  async login(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    
    if (!isMatch) {
       throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Nếu đúng hết -> Tạo token
    const tokens = await this.signTokens(user._id.toString(), user.email);
    return tokens;
  }
  //refreshToken
  async refreshTokens(refreshToken: string) {
    try {
      // Kiểm tra Refresh Token có hợp lệ không (đúng chữ ký, chưa hết hạn)
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Nếu token tốt, check xem user còn tồn tại không
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new ForbiddenException('Access Denied');

      // Cấp lại cặp token mới (Access + Refresh)
      const tokens = await this.signTokens(user._id.toString(), user.email);
      return tokens;
    } catch (e) {
      // Nếu token hết hạn hoặc sai -> Bắt buộc đăng nhập lại
      throw new ForbiddenException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }
}