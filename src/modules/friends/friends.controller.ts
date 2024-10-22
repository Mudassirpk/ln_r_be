import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { create } from './dto/create.dto';
import { FOLLOWING_STATUS } from '@prisma/client';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string) {
    return this.friendsService.getFollowers(userId);
  }

  @Get('followings/:userId')
  getFollowings(@Param('userId') userId: string) {
    return this.friendsService.getFollowings(userId);
  }

  @Post('create')
  create(@Body() body: create) {
    return this.friendsService.create(body);
  }

  @Post('status/change')
  toggleStatus(@Body() body: { id: string; status: FOLLOWING_STATUS }) {
    return this.friendsService.toggleStatus(body.id, body.status);
  }
}
