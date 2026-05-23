import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from './repositories/PrismaAuthTokenRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaSubscriptionPlanRepository } from './repositories/PrismaSubscriptionPlanRepository.js';
import { PrismaSubscriptionRepository } from './repositories/PrismaSubscriptionRepository.js';
import { PrismaInvoiceRepository } from './repositories/PrismaInvoiceRepository.js';
import { PrismaInvoiceLineRepository } from './repositories/PrismaInvoiceLineRepository.js';
import { PrismaPaymentRepository } from './repositories/PrismaPaymentRepository.js';
import { PrismaVpnSubscriptionRepository } from './repositories/PrismaVpnSubscriptionRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaSessionRepository,
    PrismaAuthTokenRepository,
    PrismaRoleRepository,
    PrismaSubscriptionPlanRepository,
    PrismaSubscriptionRepository,
    PrismaInvoiceRepository,
    PrismaInvoiceLineRepository,
    PrismaPaymentRepository,
    PrismaVpnSubscriptionRepository,
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
    PrismaInvoiceLineRepository,
    PrismaPaymentRepository,
    PrismaVpnSubscriptionRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
