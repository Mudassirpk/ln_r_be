import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create';
import { AuthGaurd } from 'guards/auth/auth.guard';
import { LoginDTO } from '../auth/dto/login';
import { LikeDTO } from './dto/like';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGaurd)
  @Post('create')
  create(@Body() body: CreatePostDTO) {
    return this.postService.create(body);
  }

  @Get('')
  get() {
    return this.postService.get();
  }

  @Post('like')
  like(@Body() body: LikeDTO) {
    return this.postService.like(body);
  }
}
