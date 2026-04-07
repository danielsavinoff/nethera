import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { TokenVerifier } from '../../../../application/ports/TokenVerifier.js';
import { ConfigService } from '@nestjs/config';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';

@Injectable()
export class JwtTokenVerifierAdapter implements TokenVerifier {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret =
      this.configService.getOrThrow<string>(
        'ACCESS_TOKEN_SECRET',
      );
    this.refreshTokenSecret =
      this.configService.getOrThrow<string>(
        'REFRESH_TOKEN_SECRET',
      );
  }

  async verifyAccessToken(token: string): Promise<AuthClaim> {
    return await this.jwtService.verifyAsync<AuthClaim>(token, {
      secret: this.accessTokenSecret,
    });
  }

  async verifyRefreshToken(token: string): Promise<AuthClaim> {
    return await this.jwtService.verifyAsync<AuthClaim>(token, {
      secret: this.refreshTokenSecret,
    });
  }
}
