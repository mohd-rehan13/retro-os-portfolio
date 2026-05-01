import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // 1. Check for Master API Key (Trusted Proxy)
    const adminApiKey = request.headers['x-admin-api-key'];
    if (adminApiKey && adminApiKey === process.env.ADMIN_API_KEY) {
      // Create a mock admin user for the request
      (request as any)['user'] = { email: 'rehanmohammad1302@gmail.com', role: 'ADMIN' };
      return true;
    }
    const sessionToken = 
      request.cookies['next-auth.session-token'] || 
      request.cookies['__Secure-next-auth.session-token'] ||
      request.headers['x-session-token'];

    if (!sessionToken) {
      throw new UnauthorizedException('No session token found');
    }

    try {
      const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
      
      // Determine which cookie name to use when forwarding to the frontend session API
      let sessionTokenKey = 'next-auth.session-token';
      if (request.cookies['__Secure-next-auth.session-token'] || frontendUrl.startsWith('https')) {
        sessionTokenKey = '__Secure-next-auth.session-token';
      }

      const response = await fetch(`${frontendUrl}/api/auth/session`, {
        headers: {
          cookie: `${sessionTokenKey}=${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException(`Session API responded with ${response.status}`);
      }

      const session = await response.json();

      if (!session || !session.user) {
        throw new UnauthorizedException('Invalid session');
      }

      // Attach user to request
      (request as any)['user'] = session.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Session validation failed');
    }
  }
}
