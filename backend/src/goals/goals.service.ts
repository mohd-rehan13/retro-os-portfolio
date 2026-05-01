import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async findForUser(userId?: string, month?: number, year?: number) {
    return this.prisma.goal.findMany({
      where: {
        ...(userId && { userId }),
        ...(month && { month }),
        ...(year && { year }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { title: string; description?: string; month: number; year: number; userId: string }) {
    return this.prisma.goal.create({ data });
  }

  async update(id: string, data: { progress?: number; status?: any }) {
    return this.prisma.goal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.goal.delete({ where: { id } });
  }
}
