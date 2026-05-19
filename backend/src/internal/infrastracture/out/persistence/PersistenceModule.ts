import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from './repositories/PrismaAuthTokenRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaPlanRepository } from './repositories/PrismaPlanRepository.js';
import { PrismaSubscriptionRepository } from './repositories/PrismaSubscriptionRepository.js';
import { PrismaSubscriptionInvoiceRepository } from './repositories/PrismaSubscriptionInvoiceRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaPlanRepository,
    PrismaSubscriptionRepository,
    PrismaSubscriptionInvoiceRepository,
    PrismaTransactionRunner,
  ],
  exports: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaPlanRepository,
    PrismaSubscriptionRepository,
    PrismaSubscriptionInvoiceRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
