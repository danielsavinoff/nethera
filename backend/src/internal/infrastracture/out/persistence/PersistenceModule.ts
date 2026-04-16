import { Module } from '@nestjs/common';
import { LoggingWiringModule } from '../logging/LoggingWiringModule.js';
import { PrismaUserRepository } from './repositories/PrismaUserRepository.js';
import { PrismaSessionRepository } from './repositories/PrismaSessionRepository.js';
import { PrismaTenantRepository } from './repositories/PrismaTenantRepository.js';
import { PrismaRoleRepository } from './repositories/PrismaRoleRepository.js';
import { PrismaTransactionRunner } from './transaction/PrismaTransactionRunner.js';
import { PrismaSmartProcessRepository } from './repositories/PrismaSmartProcessRepository.js';
import { PrismaUserFavoriteRepository } from './repositories/PrismaUserFavoriteRepository.js';
import { PrismaGroupRepository } from './repositories/PrismaGroupRepository.js';
import { PrismaTaskRepository } from './repositories/PrismaTaskRepository.js';
import { PrismaTimeAllocationRepository } from './repositories/PrismaTimeAllocationRepository.js';

@Module({
  providers: [
    PrismaUserRepository,
    PrismaTenantRepository,
    PrismaSessionRepository,
    PrismaRoleRepository,
    PrismaSmartProcessRepository,
    PrismaUserFavoriteRepository,
    PrismaGroupRepository,
    PrismaTaskRepository,
    PrismaTimeAllocationRepository,
    PrismaTransactionRunner,
  ],
  exports: [
    PrismaUserRepository,
    PrismaTenantRepository,
    PrismaSessionRepository,
    PrismaRoleRepository,
    PrismaSmartProcessRepository,
    PrismaUserFavoriteRepository,
    PrismaGroupRepository,
    PrismaTaskRepository,
    PrismaTimeAllocationRepository,
    PrismaTransactionRunner,
  ],
  imports: [LoggingWiringModule],
})
export class PersistenceModule {}
