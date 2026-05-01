import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // Balanced
  async getGoals(@CurrentUser() user: any, @Query('month') month?: string, @Query('year') year?: string) {
    return this.goalsService.findForUser(
      user?.id || user?.email, 
      month ? parseInt(month, 10) : undefined,
      year ? parseInt(year, 10) : undefined,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // Balanced
  async createGoal(@CurrentUser() user: any, @Body() body: CreateGoalDto) {
    return this.goalsService.create({
      ...body,
      userId: user.id || user.email,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // Balanced
  async updateGoal(@Param('id') id: string, @Body() body: UpdateGoalDto) {
    return this.goalsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict
  async deleteGoal(@Param('id') id: string) {
    return this.goalsService.delete(id);
  }
}
