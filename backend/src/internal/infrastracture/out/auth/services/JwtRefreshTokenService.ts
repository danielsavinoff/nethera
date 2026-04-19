import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import type { RefreshTokenService } from '../../../../application/ports/RefreshTokenService.js';

@Injectable()
export class JwtRefreshTokenService
  implements RefreshTokenService
{
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );
    this.expiresIn = Number(
      this.configService.getOrThrow<string>(
        'REFRESH_TOKEN_TTL_SECONDS',
      ),
    );
  }

  async issue(claims: AuthClaim) {
    const refreshToken = await this.jwtService.signAsync(
      claims,
      {
        secret: this.secret,
        expiresIn: this.expiresIn,
      },
    );

    return {
      refreshToken,
      refreshTokenExpiresIn: this.expiresIn,
    };
  }

  async verify(token: string): Promise<AuthClaim> {
    return await this.jwtService.verifyAsync<AuthClaim>(token, {
      secret: this.secret,
    });
  }
}
