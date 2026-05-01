import 'dotenv/config';
import { PrismaClient, Role, GoalStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- STARTING SEEDING ---');

  // 1. Clean the database
  await prisma.message.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@retro.os',
      role: Role.ADMIN,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  const member1 = await prisma.user.create({
    data: {
      name: 'Rehan Developer',
      email: 'rehan@member.os',
      role: Role.MEMBER,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rehan',
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'Cyber Nomad',
      email: 'nomad@retro.os',
      role: Role.MEMBER,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nomad',
    },
  });

  console.log('Users created.');

  // 3. Create Blog Posts (Retro Theme)
  const posts = [
    {
      title: 'The Future is Retro: Why CRT Aesthetics are Back',
      slug: 'future-is-retro',
      content: 'In an era of 4K ultra-sharp displays and minimalist flat design, there is a growing counter-culture embracing the scanlines, the glow, and the tactile feel of 80s and 90s computing. This post explores why the "lo-fi" aesthetic is more than just nostalgia—it is a functional design choice for focus and character...',
      category: 'DESIGN',
      readTime: '4M',
      published: true,
    },
    {
      title: 'Optimizing NestJS for Low-Latency Retro Apps',
      slug: 'optimizing-nestjs-retro',
      content: 'When building a modern backend for a retro-styled frontend, we often face unique challenges. We want the power of modern architecture with the simplicity of old-school APIs. In this log, we dive into caching strategies using Redis and how to structure your modules for maximum scalability...',
      category: 'DEVELOPMENT',
      readTime: '6M',
      published: true,
    },
    {
      title: 'The Lost Art of Vapourware',
      slug: 'lost-art-vapourware',
      content: 'Vapourware used to be a term of derision, but in the creative world, it represents a dream that never fully solidified. We look back at some of the most ambitious projects from the 90s that never made it to store shelves, and what they can teach us about feature creep today.',
      category: 'CULTURE',
      readTime: '3M',
      published: true,
    },
    {
      title: 'Secret Debug Menu: Build 050126',
      slug: 'secret-debug-menu',
      content: 'Accessing the hidden layers of our system requires more than just a password. It requires understanding the flow of the bits. This draft contains the preliminary notes for the upcoming system update. Do not share with unauthorized entities.',
      category: 'SYSTEM',
      readTime: '2M',
      published: false,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({ data: post });
  }

  console.log('Blog posts created.');

  // 4. Create Goals
  const goals = [
    {
      title: 'Implement Dark Luxury UI',
      description: 'Finish the Radix UI components for the member dashboard.',
      status: GoalStatus.COMPLETED,
      progress: 100,
      month: 5,
      year: 2026,
      userId: member1.id,
    },
    {
      title: 'Setup PostgreSQL Database',
      description: 'Configure Prisma and run initial migrations.',
      status: GoalStatus.COMPLETED,
      progress: 100,
      month: 5,
      year: 2026,
      userId: member1.id,
    },
    {
      title: 'Connect Frontend to API',
      description: 'Replace mock data with real fetch calls.',
      status: GoalStatus.IN_PROGRESS,
      progress: 75,
      month: 5,
      year: 2026,
      userId: member1.id,
    },
    {
      title: 'Migrate to Cloud Run',
      description: 'Deploy the backend as a containerized service.',
      status: GoalStatus.IN_PROGRESS,
      progress: 10,
      month: 6,
      year: 2026,
      userId: member1.id,
    },
  ];

  for (const goal of goals) {
    await prisma.goal.create({ data: goal });
  }

  console.log('Goals created.');

  // 5. Create Messages
  await prisma.message.create({
    data: {
      name: 'Agent Smith',
      email: 'smith@matrix.net',
      content: 'The system is more resilient than we anticipated. We need to upgrade the firewall protocols immediately.',
    },
  });

  await prisma.message.create({
    data: {
      name: 'Retro Fanatic',
      email: 'fan@geocities.com',
      content: 'I love the scanline effect on the dashboard! How did you implement the glow? It looks exactly like my old Commodore 64.',
    },
  });

  console.log('Messages created.');
  console.log('--- SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
