import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'node:fs'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      privateKey: readFileSync('./key'),
      publicKey: readFileSync('./key.pub')
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
