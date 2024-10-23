import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create';
import { AuthGaurd } from 'guards/auth/auth.guard';
import { LoginDTO } from '../auth/dto/login';
import { LikeDTO } from './dto/like';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'decorators/userId.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGaurd)
  @UseInterceptors(AnyFilesInterceptor())
  @Post('create')
  create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: CreatePostDTO,
  ) {
    return this.postService.create(body, images[0]);
  }

  @UseGuards(AuthGaurd)
  @Get('')
  get(
    @Query() { cursor, limit }: { cursor: string; limit: string },
    @UserId() userId: string,
  ) {
    return this.postService.get({ cursor, limit, userId });
  }

  @Post('like')
  like(@Body() body: LikeDTO) {
    return this.postService.like(body);
  }

  @Get(':userId')
  postsByUser(@Param('userId') userId: string) {
    return this.postService.postsByUser(userId);
  }
}
