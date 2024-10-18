import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create';
import { AuthGaurd } from 'guards/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGaurd)
  @Post('')
  create(@Body() body: CreateCommentDTO) {
    return this.commentService.create(body);
  }

  @Get('/:postId')
  get(@Param('postId') postId: string) {}
}
