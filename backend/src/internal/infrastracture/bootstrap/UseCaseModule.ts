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
import { GetDepartmentUsersUseCase } from '../../application/usecases/GetDepartmentUsersUseCase.js';
import { GetUsersUseCase } from '../../application/usecases/GetUsersUseCase.js';
import { GetDepartmentsUseCase } from '../../application/usecases/GetDepartmentsUseCase.js';
import { GetTimeAllocationsUseCase } from '../../application/usecases/GetTimeAllocationsUseCase.js';
import { GetRolesUseCase } from '../../application/usecases/GetRolesUseCase.js';
import { GetUserRolesUseCase } from '../../application/usecases/GetUserRolesUseCase.js';
import { AddUserRoleUseCase } from '../../application/usecases/AddUserRoleUseCase.js';
import { DeleteUserRoleUseCase } from '../../application/usecases/DeleteUserRoleUseCase.js';
import { GetUserFavoritesUseCase } from '../../application/usecases/GetUserFavoritesUseCase.js';
import { AddUserFavoritesUseCase } from '../../application/usecases/AddUserFavoritesUseCase.js';
import { DeleteUserFavoritesUseCase } from '../../application/usecases/DeleteUserFavoritesUseCase.js';
import { NotificationChannel } from '../../application/models/Notification.js';
import type { NotificationSender } from '../../application/ports/NotificationSender.js';
import type { TenantRepository } from '../../application/ports/TenantRepository.js';
import type { TenantCredentialsRenewer } from '../../application/ports/TenantCredentialsRenewer.js';
import type { UserRepository } from '../../application/ports/UserRepository.js';
import type { UserFavoriteRepository } from '../../application/ports/UserFavoriteRepository.js';
import type { RoleRepository } from '../../application/ports/RoleRepository.js';
import type { DepartmentProvider } from '../../application/ports/DepartmentProvider.js';
import type { EventProvider } from '../../application/ports/EventProvider.js';
import type { GroupProvider } from '../../application/ports/GroupProvider.js';
import type { UserProvider } from '../../application/ports/UserProvider.js';
import type { OauthProvider } from '../../application/ports/OauthProvider.js';
import type { SmartProcessProvider } from '../../application/ports/SmartProcessProvider.js';
import type { SmartProcessRepository } from '../../application/ports/SmartProcessRepository.js';
import type { SmartProcessFieldProvider } from '../../application/ports/SmartProcessFieldProvider.js';
import type { TaskProvider } from '../../application/ports/TaskProvider.js';
import type { TimeAllocationSmartProcessProvider } from '../../application/ports/TimeAllocationSmartProcessProvider.js';
import type { EntityProvider } from '../../application/ports/EntityProvider.js';
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
import { PrismaUserFavoriteRepository } from '../out/persistence/repositories/PrismaUserFavoriteRepository.js';
import { PrismaTransactionRunner } from '../out/persistence/transaction/PrismaTransactionRunner.js';
import { BitrixUserProvider } from '../out/bitrix/repositories/BitrixUserProvider.js';
import { BitrixEventProvider } from '../out/bitrix/repositories/BitrixEventProvider.js';
import { BitrixOauthProvider } from '../out/bitrix/oauth/BitrixOauthProvider.js';
import { BitrixTenantCredentialsRenewer } from '../out/bitrix/adapters/BitrixTenantCredentialsRenewer.js';
import { BitrixNotificationRepository } from '../out/bitrix/repositories/BitrixNotificationRepository.js';
import { BitrixSmartProcessProvider } from '../out/bitrix/repositories/BitrixSmartProcessProvider.js';
import { BitrixSmartProcessFieldProvider } from '../out/bitrix/repositories/BitrixSmartProcessFieldProvider.js';
import { BitrixEntityProvider } from '../out/bitrix/repositories/BitrixEntityProvider.js';
import { BitrixDepartmentProvider } from '../out/bitrix/repositories/BitrixDepartmentProvider.js';
import { BitrixTimeAllocationSmartProcessProvider } from '../out/bitrix/repositories/BitrixTimeAllocationSmartProcessProvider.js';
import { BitrixTaskProvider } from '../out/bitrix/repositories/BitrixTaskProvider.js';
import { BitrixGroupProvider } from '../out/bitrix/repositories/BitrixGroupProvider.js';
import { JwtTokenIssuerAdapter } from '../out/auth/adapters/JwtTokenIssuerAdapter.js';
import { JwtTokenVerifierAdapter } from '../out/auth/adapters/JwtTokenVerifierAdapter.js';
import { UserFavoritePolicy } from '../../domain/user/UserFavoritePolicy.js';

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
        userProvider: UserProvider,
        ensureTenantAuthValidityUseCase: EnsureTenantAuthValidityUseCase,
      ) => {
        return new HandleIncomingWebhookUseCase(
          eventProcessors,
          userProvider,
          ensureTenantAuthValidityUseCase,
        );
      },
      inject: [
        EVENT_PROCESSORS,
        BitrixUserProvider,
        EnsureTenantAuthValidityUseCase,
      ],
    },
    {
      provide: ProcessExternalUserAddUseCase,
      useFactory: (
        userProvider: UserProvider,
        userRepository: UserRepository,
        roleRepository: RoleRepository,
      ) => {
        return new ProcessExternalUserAddUseCase(
          userProvider,
          userRepository,
          roleRepository,
        );
      },
      inject: [
        BitrixUserProvider,
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
        userProvider: UserProvider,
        tenantRepository: TenantRepository,
        eventProvider: EventProvider,
        userRepository: UserRepository,
        roleRepository: RoleRepository,
        smartProcessRepository: SmartProcessRepository,
        smartProcessProvider: SmartProcessProvider,
        smartProcessFieldProvider: SmartProcessFieldProvider,
        entityProvider: EntityProvider,
        transactionRunner: PrismaTransactionRunner,
        logger: Logger,
      ) => {
        return new InstallAppUseCase(
          tenantRepository,
          userProvider,
          eventProvider,
          userRepository,
          roleRepository,
          smartProcessRepository,
          smartProcessProvider,
          smartProcessFieldProvider,
          entityProvider,
          transactionRunner,
          logger,
        );
      },
      inject: [
        BitrixUserProvider,
        PrismaTenantRepository,
        BitrixEventProvider,
        PrismaUserRepository,
        PrismaRoleRepository,
        PrismaSmartProcessRepository,
        BitrixSmartProcessProvider,
        BitrixSmartProcessFieldProvider,
        BitrixEntityProvider,
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
      provide: GetDepartmentUsersUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
        userProvider: UserProvider,
      ) => {
        return new GetDepartmentUsersUseCase(
          userRepository,
          tenantRepository,
          userProvider,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaTenantRepository,
        BitrixUserProvider,
      ],
    },
    {
      provide: GetUsersUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
        userProvider: UserProvider,
      ) => {
        return new GetUsersUseCase(
          userRepository,
          tenantRepository,
          userProvider,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaTenantRepository,
        BitrixUserProvider,
      ],
    },
    {
      provide: GetTimeAllocationsUseCase,
      useFactory: (
        tenantRepository: TenantRepository,
        smartProcessRepository: SmartProcessRepository,
        timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
        taskProvider: TaskProvider,
        groupProvider: GroupProvider,
      ) => {
        return new GetTimeAllocationsUseCase(
          tenantRepository,
          smartProcessRepository,
          timeAllocationSmartProcessProvider,
          taskProvider,
          groupProvider,
        );
      },
      inject: [
        PrismaTenantRepository,
        PrismaSmartProcessRepository,
        BitrixTimeAllocationSmartProcessProvider,
        BitrixTaskProvider,
        BitrixGroupProvider,
      ],
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
      provide: GetUserFavoritesUseCase,
      useFactory: (
        userRepository: UserRepository,
        userFavoriteRepository: UserFavoriteRepository,
        userFavoritePolicy: UserFavoritePolicy,
      ) => {
        return new GetUserFavoritesUseCase(
          userRepository,
          userFavoriteRepository,
          userFavoritePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaUserFavoriteRepository,
        UserFavoritePolicy,
      ],
    },
    {
      provide: AddUserFavoritesUseCase,
      useFactory: (
        userRepository: UserRepository,
        userFavoriteRepository: UserFavoriteRepository,
        userFavoritePolicy: UserFavoritePolicy,
      ) => {
        return new AddUserFavoritesUseCase(
          userRepository,
          userFavoriteRepository,
          userFavoritePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaUserFavoriteRepository,
        UserFavoritePolicy,
      ],
    },
    {
      provide: DeleteUserFavoritesUseCase,
      useFactory: (
        userRepository: UserRepository,
        userFavoriteRepository: UserFavoriteRepository,
        userFavoritePolicy: UserFavoritePolicy,
      ) => {
        return new DeleteUserFavoritesUseCase(
          userRepository,
          userFavoriteRepository,
          userFavoritePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaUserFavoriteRepository,
        UserFavoritePolicy,
      ],
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
    UserFavoritePolicy,
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
    GetDepartmentUsersUseCase,
    GetUsersUseCase,
    GetTimeAllocationsUseCase,
    GetCurrentUserUseCase,
    GetRolesUseCase,
    GetUserFavoritesUseCase,
    AddUserFavoritesUseCase,
    DeleteUserFavoritesUseCase,
    GetUserRolesUseCase,
    AddUserRoleUseCase,
    DeleteUserRoleUseCase,
  ],
})
export class UseCaseModule {}
