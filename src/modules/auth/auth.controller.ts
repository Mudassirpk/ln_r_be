import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup';
import { LoginDTO } from './dto/login';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Get('user/:id')
  user(@Param('id') id: string) {
    return this.authService.user(id);
  }
}
