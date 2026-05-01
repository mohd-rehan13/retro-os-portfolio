import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.milestone.findMany({
      orderBy: { year: 'desc' },
    });
  }

  async create(data: { year: string; title: string; description: string; active?: boolean }) {
    return this.prisma.milestone.create({
      data,
    });
  }

  async update(id: string, data: { year?: string; title?: string; description?: string; active?: boolean }) {
    return this.prisma.milestone.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.milestone.delete({
      where: { id },
    });
  }
}
