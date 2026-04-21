import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from './repositories/PrismaAuthTokenRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaPlanRepository } from './repositories/PrismaPlanRepository.js';
import { PrismaSubscriptionCheckoutRepository } from './repositories/PrismaSubscriptionCheckoutRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaPlanRepository,
    PrismaSubscriptionCheckoutRepository,
    PrismaTransactionRunner,
  ],
  exports: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaPlanRepository,
    PrismaSubscriptionCheckoutRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
