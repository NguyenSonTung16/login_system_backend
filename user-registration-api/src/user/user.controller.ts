import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common'; 
import { UserService } from './user.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  // API Lấy thông tin cá nhân (Cần Access Token)
  @UseGuards(JwtAuthGuard) // Bắt buộc phải có Token hợp lệ mới gọi được
  @Get('profile')
  async getProfile(@Req() req) {
    // req.user được tạo ra từ file jwt.strategy.ts 
    // dùng email từ token để tìm user đầy đủ trong DB
    return this.userService.findByEmail(req.user.email);
  }
}