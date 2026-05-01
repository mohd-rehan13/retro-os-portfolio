import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async createMessage(@Body() body: CreateMessageDto, @Req() req: any) {
    // Optionally extract userId if they happen to have a session token
    let userId: string | undefined;
    try {
      const sessionToken = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
      if (sessionToken) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const response = await fetch(`${frontendUrl}/api/auth/session`, {
          headers: { cookie: `next-auth.session-token=${sessionToken}` },
        });
        if (response.ok) {
          const session = await response.json();
          if (session?.user?.id) userId = session.user.id;
          else if (session?.user?.email) userId = session.user.email;
        }
      }
    } catch (e) {
      // Ignore auth errors for public route
    }

    return this.messagesService.create({ ...body, userId });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // Strict for Admin
  async getMessages() {
    return this.messagesService.findAll();
  }
}
