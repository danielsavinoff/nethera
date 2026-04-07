import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/Public.js';
import { JwtTokenVerifierAdapter } from '../../../out/auth/adapters/JwtTokenVerifierAdapter.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  cookies: Record<string, string | undefined>;
  claims?: AuthClaim;
}

export enum AuthCookie {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenVerifier: JwtTokenVerifierAdapter,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const type = context.getType();

    let instance: AuthenticatedRequest;

    if (type === 'http') {
      instance = context
        .switchToHttp()
        .getRequest<AuthenticatedRequest>();
    } else {
      throw new UnauthorizedException();
    }

    const isBrowser = Boolean(
      instance.headers['sec-fetch-site'],
    );

    if (isBrowser) {
      const referer = instance.headers.referer;
      const allowedDomain = String(
        this.configService.getOrThrow('DOMAIN'),
      );

      if (!referer?.startsWith(`https://${allowedDomain}`)) {
        throw new UnauthorizedException();
      }
    }

    const token = instance.cookies[AuthCookie.AccessToken];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload =
        await this.tokenVerifier.verifyAccessToken(token);

      instance.claims = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
