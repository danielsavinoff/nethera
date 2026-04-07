import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaTenantRepository } from './repositories/PrismaTenantRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaTenantRepository,
    PrismaSessionRepository,
    PrismaRoleRepository,
    PrismaTransactionRunner,
  ],
  exports: [
    PrismaUserRepository,
    PrismaTenantRepository,
    PrismaSessionRepository,
    PrismaRoleRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
