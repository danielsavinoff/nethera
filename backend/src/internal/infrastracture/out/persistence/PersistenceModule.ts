import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from './repositories/PrismaAuthTokenRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaSubscriptionPlanRepository } from './repositories/PrismaSubscriptionPlanRepository.js';
import { PrismaSubscriptionRepository } from './repositories/PrismaSubscriptionRepository.js';
import { PrismaInvoiceRepository } from './repositories/PrismaInvoiceRepository.js';
import { PrismaPaymentRepository } from './repositories/PrismaPaymentRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';
import { PrismaInvoiceSubscriptionRepository } from './repositories/PrismaInvoiceSubscriptionRepository.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaSubscriptionPlanRepository,
    PrismaSubscriptionRepository,
    PrismaInvoiceRepository,
    PrismaPaymentRepository,
    PrismaInvoiceSubscriptionRepository,
    PrismaTransactionRunner,
  ],
  exports: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaSubscriptionPlanRepository,
    PrismaSubscriptionRepository,
    PrismaInvoiceRepository,
    PrismaPaymentRepository,
    PrismaInvoiceSubscriptionRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
