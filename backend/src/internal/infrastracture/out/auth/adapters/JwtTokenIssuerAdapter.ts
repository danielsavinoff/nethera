import { Injectable } from '@nestjs/common';
import type {
  IssueTokensData,
  TokenIssuer,
} from '../../../../application/ports/TokenIssuer.js';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { IssuedTokenSet } from '../../../../application/models/IssuedTokenSet.js';

@Injectable()
export class JwtTokenIssuerAdapter implements TokenIssuer {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: number;

  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: number;

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

    this.accessTokenExpiresIn = Number(
      this.configService.getOrThrow<string>(
        'ACCESS_TOKEN_TTL_SECONDS',
      ),
    );
    this.refreshTokenExpiresIn = Number(
      this.configService.getOrThrow<string>(
        'REFRESH_TOKEN_TTL_SECONDS',
      ),
    );
  }

  async issue<T extends boolean>(
    data: IssueTokensData<T>,
  ): Promise<IssuedTokenSet<T>> {
    const includeRefreshToken =
      data.includeRefreshToken ?? false;

    const accessToken = await this.jwtService.signAsync(
      data.claims,
      {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpiresIn,
      },
    );

    if (includeRefreshToken === true) {
      const refreshToken = await this.jwtService.signAsync(
        data.claims,
        {
          secret: this.refreshTokenSecret,
          expiresIn: this.refreshTokenExpiresIn,
        },
      );

      return {
        accessToken: accessToken,
        accessTokenExpiresIn: this.accessTokenExpiresIn,
        refreshToken: refreshToken,
        refreshTokenExpiresIn: this.refreshTokenExpiresIn,
      } as IssuedTokenSet<T>;
    }

    return {
      accessToken: accessToken,
      accessTokenExpiresIn: this.accessTokenExpiresIn,
    } as IssuedTokenSet<T>;
  }
}
