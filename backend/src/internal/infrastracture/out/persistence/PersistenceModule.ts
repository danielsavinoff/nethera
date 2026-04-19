import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from './repositories/PrismaAuthTokenRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaTransactionRunner,
  ],
  exports: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
