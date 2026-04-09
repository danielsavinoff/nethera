import { Module } from '@nestjs/common';
import type { Logger } from '../../domain/logging/Logger.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import { HandleIncomingWebhookUseCase } from '../../application/usecases/HandleIncomingWebhookUseCase.js';
import { ProcessExternalUserAddUseCase } from '../../application/usecases/ProcessExternalUserAddUseCase.js';
import { InstallAppUseCase } from '../../application/usecases/InstallAppUseCase.js';
import { ProcessAppInstallUseCase } from '../../application/usecases/ProcessAppInstallUseCase.js';
import { LoginWithOauthProviderUseCase } from '../../application/usecases/LoginWithOauthProviderUseCase.js';
import { RefreshAccessTokenUseCase } from '../../application/usecases/RefreshAccessTokenUseCase.js';
import { EnsureTenantAuthValidityUseCase } from '../../application/usecases/EnsureTenantAuthValidityUseCase.js';
import { SendNotificationsUseCase } from '../../application/usecases/SendNotificationsUseCase.js';
import { GetCurrentUserUseCase } from '../../application/usecases/GetCurrentUserUseCase.js';
import { GetUsersUseCase } from '../../application/usecases/GetUsersUseCase.js';
import { GetDepartmentsUseCase } from '../../application/usecases/GetDepartmentsUseCase.js';
import { GetRolesUseCase } from '../../application/usecases/GetRolesUseCase.js';
import { GetUserRolesUseCase } from '../../application/usecases/GetUserRolesUseCase.js';
import { AddUserRoleUseCase } from '../../application/usecases/AddUserRoleUseCase.js';
import { DeleteUserRoleUseCase } from '../../application/usecases/DeleteUserRoleUseCase.js';
import { NotificationChannel } from '../../application/models/Notification.js';
import type { NotificationSender } from '../../application/ports/NotificationSender.js';
import type { TenantRepository } from '../../application/ports/TenantRepository.js';
import type { TenantCredentialsRenewer } from '../../application/ports/TenantCredentialsRenewer.js';
import type { UserRepository } from '../../application/ports/UserRepository.js';
import type { RoleRepository } from '../../application/ports/RoleRepository.js';
import type { DepartmentProvider } from '../../application/ports/DepartmentProvider.js';
import type { EventRepository } from '../../application/ports/EventRepository.js';
import type { ExternalUserRepository } from '../../application/ports/ExternalUserRepository.js';
import type { OauthProvider } from '../../application/ports/OauthProvider.js';
import type { SmartProcessProvider } from '../../application/ports/SmartProcessProvider.js';
import type { SmartProcessRepository } from '../../application/ports/SmartProcessRepository.js';
import type { TokenIssuer } from '../../application/ports/TokenIssuer.js';
import type { SessionRepository } from '../../application/ports/SessionRepository.js';
import type { TokenVerifier } from '../../application/ports/TokenVerifier.js';
import { PersistenceModule } from '../out/persistence/PersistenceModule.js';
import { BitrixModule } from '../out/bitrix/BitrixModule.js';
import { LoggingWiringModule } from '../out/logging/LoggingWiringModule.js';
import { AuthModule } from '../out/auth/AuthModule.js';
import { NestConsoleLogger } from '../out/logging/loggers/NestConsoleLogger.js';
import { PrismaTenantRepository } from '../out/persistence/repositories/PrismaTenantRepository.js';
import { PrismaUserRepository } from '../out/persistence/repositories/PrismaUserRepository.js';
import { PrismaRoleRepository } from '../out/persistence/repositories/PrismaRoleRepository.js';
import { PrismaSmartProcessRepository } from '../out/persistence/repositories/PrismaSmartProcessRepository.js';
import { PrismaSessionRepository } from '../out/persistence/repositories/PrismaSessionRepository.js';
import { PrismaTransactionRunner } from '../out/persistence/transaction/PrismaTransactionRunner.js';
import { BitrixUserRepository } from '../out/bitrix/repositories/BitrixUserRepository.js';
import { BitrixEventRepository } from '../out/bitrix/repositories/BitrixEventRepository.js';
import { BitrixOauthProvider } from '../out/bitrix/oauth/BitrixOauthProvider.js';
import { BitrixTenantCredentialsRenewer } from '../out/bitrix/adapters/BitrixTenantCredentialsRenewer.js';
import { BitrixNotificationRepository } from '../out/bitrix/repositories/BitrixNotificationRepository.js';
import { BitrixSmartProcessProvider } from '../out/bitrix/repositories/BitrixSmartProcessProvider.js';
import { BitrixDepartmentProvider } from '../out/bitrix/repositories/BitrixDepartmentProvider.js';
import { JwtTokenIssuerAdapter } from '../out/auth/adapters/JwtTokenIssuerAdapter.js';
import { JwtTokenVerifierAdapter } from '../out/auth/adapters/JwtTokenVerifierAdapter.js';

const NOTIFICATION_CHANNELS = Symbol('NOTIFICATION_CHANNELS');
const EVENT_PROCESSORS = Symbol('EVENT_PROCESSORS');

@Module({
  imports: [
    PersistenceModule,
    BitrixModule,
    LoggingWiringModule,
    AuthModule,
  ],
  providers: [
    {
      provide: HandleIncomingWebhookUseCase,
      useFactory: (
        eventProcessors: Record<
          string,
          | ProcessAppInstallUseCase
          | ProcessExternalUserAddUseCase
        >,
        externalUserRepository: ExternalUserRepository,
        ensureTenantAuthValidityUseCase: EnsureTenantAuthValidityUseCase,
      ) => {
        return new HandleIncomingWebhookUseCase(
          eventProcessors,
          externalUserRepository,
          ensureTenantAuthValidityUseCase,
        );
      },
      inject: [
        EVENT_PROCESSORS,
        BitrixUserRepository,
        EnsureTenantAuthValidityUseCase,
      ],
    },
    {
      provide: ProcessExternalUserAddUseCase,
      useFactory: (
        externalUserRepository: ExternalUserRepository,
        userRepository: UserRepository,
        roleRepository: RoleRepository,
      ) => {
        return new ProcessExternalUserAddUseCase(
          externalUserRepository,
          userRepository,
          roleRepository,
        );
      },
      inject: [
        BitrixUserRepository,
        PrismaUserRepository,
        PrismaRoleRepository,
      ],
    },
    {
      provide: SendNotificationsUseCase,
      useFactory: (
        notificationChannels: Record<
          NotificationChannel,
          NotificationSender
        >,
      ) => {
        return new SendNotificationsUseCase(
          notificationChannels,
        );
      },
      inject: [NOTIFICATION_CHANNELS],
    },
    {
      provide: LoginWithOauthProviderUseCase,
      useFactory: (
        oauthProvider: OauthProvider,
        userRepository: UserRepository,
        tokenIssuer: TokenIssuer,
        sessionRepository: SessionRepository,
      ) => {
        return new LoginWithOauthProviderUseCase(
          oauthProvider,
          userRepository,
          tokenIssuer,
          sessionRepository,
        );
      },
      inject: [
        BitrixOauthProvider,
        PrismaUserRepository,
        JwtTokenIssuerAdapter,
        PrismaSessionRepository,
      ],
    },
    {
      provide: RefreshAccessTokenUseCase,
      useFactory: (
        userRepository: UserRepository,
        sessionRepository: SessionRepository,
        tenantRepository: TenantRepository,
        tokenIssuer: TokenIssuer,
        tokenVerifier: TokenVerifier,
      ) => {
        return new RefreshAccessTokenUseCase(
          userRepository,
          sessionRepository,
          tenantRepository,
          tokenIssuer,
          tokenVerifier,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSessionRepository,
        PrismaTenantRepository,
        JwtTokenIssuerAdapter,
        JwtTokenVerifierAdapter,
      ],
    },
    {
      provide: EnsureTenantAuthValidityUseCase,
      useFactory: (
        tenantRepository: TenantRepository,
        tenantCredentialsRenewer: TenantCredentialsRenewer,
      ) => {
        return new EnsureTenantAuthValidityUseCase(
          tenantRepository,
          tenantCredentialsRenewer,
        );
      },
      inject: [
        PrismaTenantRepository,
        BitrixTenantCredentialsRenewer,
      ],
    },
    {
      provide: InstallAppUseCase,
      useFactory: (
        externalUserRepository: ExternalUserRepository,
        tenantRepository: TenantRepository,
        eventRepository: EventRepository,
        userRepository: UserRepository,
        roleRepository: RoleRepository,
        smartProcessRepository: SmartProcessRepository,
        smartProcessProvider: SmartProcessProvider,
        transactionRunner: PrismaTransactionRunner,
        logger: Logger,
      ) => {
        return new InstallAppUseCase(
          tenantRepository,
          externalUserRepository,
          eventRepository,
          userRepository,
          roleRepository,
          smartProcessRepository,
          smartProcessProvider,
          transactionRunner,
          logger,
        );
      },
      inject: [
        BitrixUserRepository,
        PrismaTenantRepository,
        BitrixEventRepository,
        PrismaUserRepository,
        PrismaRoleRepository,
        PrismaSmartProcessRepository,
        BitrixSmartProcessProvider,
        PrismaTransactionRunner,
        NestConsoleLogger,
      ],
    },
    {
      provide: ProcessAppInstallUseCase,
      useFactory: (
        tenantRepository: TenantRepository,
        logger: Logger,
      ) => {
        return new ProcessAppInstallUseCase(
          tenantRepository,
          logger,
        );
      },
      inject: [PrismaTenantRepository, NestConsoleLogger],
    },
    {
      provide: GetDepartmentsUseCase,
      useFactory: (
        tenantRepository: TenantRepository,
        departmentProvider: DepartmentProvider,
      ) => {
        return new GetDepartmentsUseCase(
          tenantRepository,
          departmentProvider,
        );
      },
      inject: [PrismaTenantRepository, BitrixDepartmentProvider],
    },
    {
      provide: GetUsersUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUsersUseCase(userRepository);
      },
      inject: [PrismaUserRepository],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetCurrentUserUseCase(userRepository);
      },
      inject: [PrismaUserRepository],
    },
    {
      provide: GetRolesUseCase,
      useFactory: (roleRepository: RoleRepository) => {
        return new GetRolesUseCase(roleRepository);
      },
      inject: [PrismaRoleRepository],
    },
    {
      provide: GetUserRolesUseCase,
      useFactory: (
        userRepository: UserRepository,
        rolePolicy: RolePolicy,
      ) => {
        return new GetUserRolesUseCase(
          userRepository,
          rolePolicy,
        );
      },
      inject: [PrismaUserRepository, RolePolicy],
    },
    {
      provide: AddUserRoleUseCase,
      useFactory: (
        userRepository: UserRepository,
        roleRepository: RoleRepository,
        rolePolicy: RolePolicy,
      ) => {
        return new AddUserRoleUseCase(
          userRepository,
          roleRepository,
          rolePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaRoleRepository,
        RolePolicy,
      ],
    },
    {
      provide: DeleteUserRoleUseCase,
      useFactory: (
        userRepository: UserRepository,
        roleRepository: RoleRepository,
        rolePolicy: RolePolicy,
      ) => {
        return new DeleteUserRoleUseCase(
          userRepository,
          roleRepository,
          rolePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaRoleRepository,
        RolePolicy,
      ],
    },
    RolePolicy,
    {
      provide: EVENT_PROCESSORS,
      useFactory: (
        processBitrixUserAdd: ProcessExternalUserAddUseCase,
        processAppInstallUseCase: ProcessAppInstallUseCase,
      ) => ({
        ONUSERADD: processBitrixUserAdd,
        ONAPPINSTALL: processAppInstallUseCase,
      }),
      inject: [
        ProcessExternalUserAddUseCase,
        ProcessAppInstallUseCase,
      ],
    },
    {
      provide: NOTIFICATION_CHANNELS,
      useFactory: (notificationSender: NotificationSender) => ({
        [NotificationChannel.CRM]: notificationSender,
      }),
      inject: [BitrixNotificationRepository],
    },
  ],
  exports: [
    HandleIncomingWebhookUseCase,
    InstallAppUseCase,
    ProcessExternalUserAddUseCase,
    LoginWithOauthProviderUseCase,
    RefreshAccessTokenUseCase,
    EnsureTenantAuthValidityUseCase,
    SendNotificationsUseCase,
    GetDepartmentsUseCase,
    GetUsersUseCase,
    GetCurrentUserUseCase,
    GetRolesUseCase,
    GetUserRolesUseCase,
    AddUserRoleUseCase,
    DeleteUserRoleUseCase,
  ],
})
export class UseCaseModule {}
