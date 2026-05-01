import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRole(id: string, role: any) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async getAnalytics() {
    const [totalUsers, totalPosts, totalMessages, adminCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.blogPost.count(),
      this.prisma.message.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    return {
      totalUsers,
      totalPosts,
      totalMessages,
      adminCount,
      memberCount: totalUsers - adminCount,
      timestamp: new Date().toISOString(),
    };
  }
}
