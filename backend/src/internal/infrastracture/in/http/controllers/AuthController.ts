import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantGuard } from '../guards/TenantGuard.js';
import { BitrixOauthAuthContextMapper } from '../../../out/bitrix/mappers/BitrixOauthAuthContextMapper.js';
import { LoginWithOauthProviderUseCase } from '../../../../application/usecases/LoginWithOauthProviderUseCase.js';
import { RefreshAccessTokenUseCase } from '../../../../application/usecases/RefreshAccessTokenUseCase.js';
import type { Request } from 'express';
import type { Response } from 'express';
import { TenantDecorator } from '../decorators/Tenant.js';
import { Tenant } from '../../../../../internal/domain/tenant/Tenant.js';
import { AuthCookie } from '../guards/AuthGuard.js';
import { Public } from '../decorators/Public.js';
import { LoginWithOauthRequestDto } from '../dtos/LoginWithOauthRequestDto.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly bitrixOauthAuthContextMapper: BitrixOauthAuthContextMapper,
    private readonly loginWithOauthProviderUseCase: LoginWithOauthProviderUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
  ) {}

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

      const tokens =
        await this.refreshAccessTokenUseCase.execute({
          refreshToken: refreshToken,
        });

      response.cookie(
        AuthCookie.AccessToken,
        tokens.accessToken,
        {
          httpOnly: true,
          maxAge: tokens.accessTokenExpiresIn * 1000,
          secure: true,
          sameSite: 'none',
        },
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('login/oauth')
  @UseGuards(TenantGuard)
  async handleLoginWithOauth(
    @Body() loginWithOauthRequestDto: LoginWithOauthRequestDto,
    @TenantDecorator() tenant: Tenant,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const authContext = this.bitrixOauthAuthContextMapper.map({
        auth: loginWithOauthRequestDto,
        tenant: tenant,
      });
      const { tokens } =
        await this.loginWithOauthProviderUseCase.execute({
          tenant: tenant,
          tenantCredentials: authContext,
          language: loginWithOauthRequestDto.language,
        });

      response.cookie(
        AuthCookie.RefreshToken,
        tokens.refreshToken,
        {
          httpOnly: true,
          maxAge: tokens.refreshTokenExpiresIn * 1000,
          secure: true,
          sameSite: 'none',
        },
      );
      response.cookie(
        AuthCookie.AccessToken,
        tokens.accessToken,
        {
          httpOnly: true,
          maxAge: tokens.accessTokenExpiresIn * 1000,
          secure: true,
          sameSite: 'none',
        },
      );
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
