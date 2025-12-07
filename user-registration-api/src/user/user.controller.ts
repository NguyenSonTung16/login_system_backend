import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt')) // Yêu cầu phải có Token mới cho vào
  @Get('profile')
  getProfile(@Req() req: any) {
    return {
      message: 'Chúc mừng! Bạn đã truy cập vào vùng bảo mật.',
      user: req.user, // Trả về thông tin user lấy từ token
    };
  }
}