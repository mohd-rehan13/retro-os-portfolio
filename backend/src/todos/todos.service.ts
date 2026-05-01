import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { task: string }) {
    return this.prisma.todo.create({
      data,
    });
  }

  async update(id: string, data: { task?: string; completed?: boolean }) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
