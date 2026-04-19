import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import type { AccessTokenService } from '../../../../application/ports/AccessTokenService.js';

@Injectable()
export class JwtAccessTokenService
  implements AccessTokenService
{
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.expiresIn = Number(
      this.configService.getOrThrow<string>(
        'ACCESS_TOKEN_TTL_SECONDS',
      ),
    );
  }

  async issue(claims: AuthClaim) {
    const accessToken = await this.jwtService.signAsync(
      claims,
      {
        secret: this.secret,
        expiresIn: this.expiresIn,
      },
    );

    return {
      accessToken,
      accessTokenExpiresIn: this.expiresIn,
    };
  }

  async verify(token: string): Promise<AuthClaim> {
    return await this.jwtService.verifyAsync<AuthClaim>(token, {
      secret: this.secret,
    });
  }
}
