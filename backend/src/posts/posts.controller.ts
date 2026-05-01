import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async getPosts() {
    return this.postsService.findAllPublished();
  }

  @Get('admin/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  async getAdminPosts() {
    return this.postsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict for Admin
  async createPost(@Body() body: CreatePostDto) {
    return this.postsService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict for Admin
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async deletePost(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
