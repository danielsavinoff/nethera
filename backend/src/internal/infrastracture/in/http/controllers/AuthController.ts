import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiNoContentResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import type { Response } from 'express';

import { MagicLinkAlreadyUsedException } from '../../../../application/exceptions/MagicLinkAlreadyUsedException.js';
import { MagicLinkExpiredException } from '../../../../application/exceptions/MagicLinkExpiredException.js';
import { MagicLinkInvalidException } from '../../../../application/exceptions/MagicLinkInvalidException.js';
import { LoginWithMagicLinkUseCase } from '../../../../application/usecases/LoginWithMagicLinkUseCase.js';
import { RefreshAccessTokenUseCase } from '../../../../application/usecases/RefreshAccessTokenUseCase.js';
import { SendMagicLinkUseCase } from '../../../../application/usecases/SendMagicLinkUseCase.js';
import { Public } from '../decorators/Public.js';
import { LoginWithMagicLinkQueryDto } from '../dtos/LoginWithMagicLinkQueryDto.js';
import { SendMagicLinkRequestDto } from '../dtos/SendMagicLinkRequestDto.js';
import { AuthCookie } from '../guards/AuthGuard.js';

@Public()
@Controller('auth')
export class AuthController {
  private readonly MAGIC_LINK_TTL_SECONDS: number;

  constructor(
    private readonly sendMagicLinkUseCase: SendMagicLinkUseCase,
    private readonly loginWithMagicLinkUseCase: LoginWithMagicLinkUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly configService: ConfigService,
  ) {
    this.MAGIC_LINK_TTL_SECONDS = Number(
      this.configService.getOrThrow<string>(
        'MAGIC_LINK_TTL_SECONDS',
      ),
    );
  }

  @Post('token')
  async handleTokenRenewal(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken =
        request.cookies?.[AuthCookie.RefreshToken];

      if (typeof refreshToken !== 'string') {
        throw new UnauthorizedException();
      }

      const result =
        await this.refreshAccessTokenUseCase.execute({
          refreshToken: refreshToken,
        });

      response.cookie(
        AuthCookie.AccessToken,
        result.accessToken,
        {
          httpOnly: true,
          maxAge: result.accessTokenExpiresIn * 1000,
          secure: true,
          sameSite: 'lax',
        },
      );
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }

  @Post('magic/request')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async handleRequestMagicLink(
    @Body() sendMagicLinkRequestDto: SendMagicLinkRequestDto,
    @Req() request: Request,
  ) {
    await this.sendMagicLinkUseCase.execute({
      email: sendMagicLinkRequestDto.email,
      magicLinkTtlSeconds: this.MAGIC_LINK_TTL_SECONDS,
      requestedIp: request.ip,
      requestedUserAgent:
        typeof request.headers['user-agent'] === 'string'
          ? request.headers['user-agent']
          : undefined,
    });
  }

  @Get('magic/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async handleVerifyMagicLink(
    @Query()
    loginWithMagicLinkQueryDto: LoginWithMagicLinkQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result =
        await this.loginWithMagicLinkUseCase.execute({
          token: loginWithMagicLinkQueryDto.token,
        });

      const data = result.data;

      response.cookie(
        AuthCookie.RefreshToken,
        data.tokens.refreshToken,
        {
          httpOnly: true,
          maxAge: data.tokens.refreshTokenExpiresIn * 1000,
          secure: true,
          sameSite: 'lax',
        },
      );
      response.cookie(
        AuthCookie.AccessToken,
        data.tokens.accessToken,
        {
          httpOnly: true,
          maxAge: data.tokens.accessTokenExpiresIn * 1000,
          secure: true,
          sameSite: 'lax',
        },
      );
    } catch (error) {
      if (
        error instanceof MagicLinkInvalidException ||
        error instanceof MagicLinkExpiredException ||
        error instanceof MagicLinkAlreadyUsedException
      ) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }
}
