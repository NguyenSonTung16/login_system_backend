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
    PassportModule, 
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, 
  ],
  exports: [AuthService],
})
export class AuthModule {}