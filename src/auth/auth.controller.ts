import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
} from '../../../../packages/common/src/dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body(ValidationPipe) dto: LoginDto) {
    return this.auth.login(dto);
  }
}
