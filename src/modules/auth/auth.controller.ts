import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup';
import { LoginDTO } from './dto/login';
import { AuthGaurd } from 'guards/auth/auth.guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'decorators/userId.decorator';

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

  @UseGuards(AuthGaurd)
  @UseInterceptors(AnyFilesInterceptor())
  @Post('profile-pic')
  update_profile_pic(
    @UploadedFiles() images: Express.Multer.File[],
    @UserId() userId: string,
  ) {
    return this.authService.add_user_image(images[0], userId);
  }
}
