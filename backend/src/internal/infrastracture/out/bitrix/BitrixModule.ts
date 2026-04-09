import { Module } from '@nestjs/common';
import { BitrixEventRepository } from './repositories/BitrixEventRepository.js';
import { BitrixUserRepository } from './repositories/BitrixUserRepository.js';
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
    BitrixEventRepository,
    BitrixUserRepository,
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
    BitrixEventRepository,
    BitrixUserRepository,
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
