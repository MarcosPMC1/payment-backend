import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/registrate-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() data: LoginDto){
    return this.authService.Login(data)
  }

  @Post('register')
  registrate(@Body() data: UserDto){
    return this.authService.Register(data)
  }
}
