import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// User service - Business logic: check email, hash password, create user
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: RegisterDto) {
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new BadRequestException('Email đã được sử dụng');
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng ký người dùng');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }

      return {
        message: 'Đăng nhập thành công',
        id: user._id,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Đã xảy ra lỗi khi đăng nhập');
    }
  }
}