import { Module } from '@nestjs/common';
import { JwtTokenIssuerAdapter } from './adapters/JwtTokenIssuerAdapter.js';
import { JwtTokenVerifierAdapter } from './adapters/JwtTokenVerifierAdapter.js';

@Module({
  providers: [JwtTokenIssuerAdapter, JwtTokenVerifierAdapter],
  exports: [JwtTokenIssuerAdapter, JwtTokenVerifierAdapter],
})
export class AuthModule {}
