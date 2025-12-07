import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'; 
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule, // 👈 3. Thêm PassportModule vào đây
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // 👈 4. QUAN TRỌNG NHẤT: Thêm JwtStrategy vào đây
  ],
  exports: [AuthService],
})
export class AuthModule {}