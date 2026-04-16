import { Module } from '@nestjs/common';
import { BitrixEventProvider } from './repositories/BitrixEventProvider.js';
import { BitrixUserProvider } from './repositories/BitrixUserProvider.js';
import { BitrixNotificationRepository } from './repositories/BitrixNotificationRepository.js';
import { BitrixClient } from './clients/BitrixClient.js';
import { BitrixOauthAuthContextMapper } from './mappers/BitrixOauthAuthContextMapper.js';
import { BitrixEventModelMapper } from './mappers/BitrixEventModelMapper.js';
import { BitrixTenantCredentialsRenewer } from './adapters/BitrixTenantCredentialsRenewer.js';
import { BitrixOauthProvider } from './oauth/BitrixOauthProvider.js';
import { BitrixSmartProcessProvider } from './repositories/BitrixSmartProcessProvider.js';
import { BitrixDepartmentProvider } from './repositories/BitrixDepartmentProvider.js';
import { BitrixSmartProcessFieldProvider } from './repositories/BitrixSmartProcessFieldProvider.js';
import { BitrixEntityProvider } from './repositories/BitrixEntityProvider.js';
import { BitrixTimeAllocationSmartProcessProvider } from './repositories/BitrixTimeAllocationSmartProcessProvider.js';
import { BitrixTaskProvider } from './repositories/BitrixTaskProvider.js';
import { BitrixGroupProvider } from './repositories/BitrixGroupProvider.js';

@Module({
  providers: [
    BitrixEventProvider,
    BitrixUserProvider,
    BitrixNotificationRepository,
    BitrixClient,
    BitrixOauthAuthContextMapper,
    BitrixEventModelMapper,
    BitrixOauthProvider,
    BitrixTenantCredentialsRenewer,
    BitrixSmartProcessProvider,
    BitrixSmartProcessFieldProvider,
    BitrixEntityProvider,
    BitrixDepartmentProvider,
    BitrixTimeAllocationSmartProcessProvider,
    BitrixTaskProvider,
    BitrixGroupProvider,
  ],
  exports: [
    BitrixEventProvider,
    BitrixUserProvider,
    BitrixNotificationRepository,
    BitrixOauthAuthContextMapper,
    BitrixEventModelMapper,
    BitrixOauthProvider,
    BitrixTenantCredentialsRenewer,
    BitrixSmartProcessProvider,
    BitrixSmartProcessFieldProvider,
    BitrixEntityProvider,
    BitrixDepartmentProvider,
    BitrixTimeAllocationSmartProcessProvider,
    BitrixTaskProvider,
    BitrixGroupProvider,
  ],
})
export class BitrixModule {}
