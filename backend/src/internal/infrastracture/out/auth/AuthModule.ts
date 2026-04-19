import { Module } from '@nestjs/common';
import { CryptoMagicLinkTokenService } from './services/CryptoMagicLinkTokenService.js';
import { JwtAccessTokenService } from './services/JwtAccessTokenService.js';
import { JwtRefreshTokenService } from './services/JwtRefreshTokenService.js';

@Module({
  providers: [
    CryptoMagicLinkTokenService,
    JwtAccessTokenService,
    JwtRefreshTokenService,
  ],
  exports: [
    CryptoMagicLinkTokenService,
    JwtAccessTokenService,
    JwtRefreshTokenService,
  ],
})
export class AuthModule {}
