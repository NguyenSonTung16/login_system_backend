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

  // --- HÀM 1: TẠO CẶP TOKEN ---
  async signTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      // 1. Tạo Access Token
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        // 👇 SỬA LỖI Ở ĐÂY: Thêm 'as any' để TypeScript không bắt bẻ kiểu dữ liệu
        expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '10s') as any, 
      }),
      
      // 2. Tạo Refresh Token
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        // 👇 SỬA LỖI Ở ĐÂY
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // --- HÀM 2: XỬ LÝ LOGIN ---
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
      // 1. Kiểm tra Refresh Token có hợp lệ không (đúng chữ ký, chưa hết hạn)
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // 2. Nếu token tốt, check xem user còn tồn tại không
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new ForbiddenException('Access Denied');

      // 3. Cấp lại cặp token mới (Access + Refresh) -> Token Rotation (Bảo mật cao)
      const tokens = await this.signTokens(user._id.toString(), user.email);
      return tokens;
    } catch (e) {
      // Nếu token hết hạn hoặc sai -> Bắt buộc đăng nhập lại
      throw new ForbiddenException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }
}