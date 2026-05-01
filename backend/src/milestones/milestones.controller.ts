import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  findAll() {
    return this.milestonesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() data: { year: string; title: string; description: string; active?: boolean }) {
    return this.milestonesService.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() data: { year?: string; title?: string; description?: string; active?: boolean }) {
    return this.milestonesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.milestonesService.remove(id);
  }
}
