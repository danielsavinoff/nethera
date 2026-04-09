import { Module } from '@nestjs/common';
import { BitrixEventProvider } from './repositories/BitrixEventProvider.js';
import { BitrixUserProvider } from './repositories/BitrixUserProvider.js';
import { BitrixNotificationRepository } from './repositories/BitrixNotificationRepository.js';
import { BitrixClient } from './clients/BitrixClient.js';
import { BitrixOauthAuthContextMapper } from './mappers/BitrixOauthAuthContextMapper.js';
import { BitrixEventModelMapper } from './mappers/BitrixEventModelMapper.js';
import { BitrixEventAuthContextMapper } from './mappers/BitrixEventAuthContextMapper.js';
import { BitrixTenantCredentialsRenewer } from './adapters/BitrixTenantCredentialsRenewer.js';
import { BitrixOauthProvider } from './oauth/BitrixOauthProvider.js';
import { BitrixSmartProcessProvider } from './repositories/BitrixSmartProcessProvider.js';
import { BitrixDepartmentProvider } from './repositories/BitrixDepartmentProvider.js';

@Module({
  providers: [
    BitrixEventProvider,
    BitrixUserProvider,
    BitrixNotificationRepository,
    BitrixClient,
    BitrixOauthAuthContextMapper,
    BitrixEventAuthContextMapper,
    BitrixEventModelMapper,
    BitrixOauthProvider,
    BitrixTenantCredentialsRenewer,
    BitrixSmartProcessProvider,
    BitrixDepartmentProvider,
  ],
  exports: [
    BitrixEventProvider,
    BitrixUserProvider,
    BitrixNotificationRepository,
    BitrixOauthAuthContextMapper,
    BitrixEventAuthContextMapper,
    BitrixEventModelMapper,
    BitrixOauthProvider,
    BitrixTenantCredentialsRenewer,
    BitrixSmartProcessProvider,
    BitrixDepartmentProvider,
  ],
})
export class BitrixModule {}
