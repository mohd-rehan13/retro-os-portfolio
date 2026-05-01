import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get()
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict for Admin
  async getUsers() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.updateRole(id, role);
  }

  @Get('analytics')
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict for Admin
  async getAnalytics() {
    return this.usersService.getAnalytics();
  }
}
