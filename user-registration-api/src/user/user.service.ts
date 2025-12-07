import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: RegisterDto) {
    // ... (Giữ nguyên code hàm register cũ của bạn ở đây) ...
    try {
      const exists = await this.userModel.findOne({ email: dto.email });
      if (exists) {
        throw new BadRequestException('Email đã được sử dụng');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      const newUser = new this.userModel({
        email: dto.email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      return {
        message: 'User registered successfully',
        id: savedUser._id,
        email: savedUser.email,
      };
    } catch (error) {
      // ... (Giữ nguyên xử lý lỗi cũ) ...
        if (error instanceof BadRequestException) {
            throw error;
        }
        if (error.code === 11000) {
            throw new BadRequestException('Email đã được sử dụng');
        }
        throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký người dùng');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    // Tìm user và trả về đầy đủ thông tin (bao gồm cả mật khẩu đã hash để so sánh)
    return this.userModel.findOne({ email }).exec();
  }
}