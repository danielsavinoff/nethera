import { Module } from '@nestjs/common';
import type { Logger } from '../../domain/logging/Logger.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import { DispatchIncomingWebhookUseCase } from '../../application/usecases/DispatchIncomingWebhookUseCase.js';
import type { EventHandlerUseCase } from '../../application/usecases/DispatchIncomingWebhookUseCase.js';
import { HandleExternalUserAddedUseCase } from '../../application/usecases/HandleExternalUserAddedUseCase.js';
import { HandleExternalTaskAddedUseCase } from '../../application/usecases/HandleExternalTaskAddedUseCase.js';
import { HandleExternalTaskUpdatedUseCase } from '../../application/usecases/HandleExternalTaskUpdatedUseCase.js';
import { HandleExternalTaskDeletedUseCase } from '../../application/usecases/HandleExternalTaskDeletedUseCase.js';
import { HandleExternalGroupAddedUseCase } from '../../application/usecases/HandleExternalGroupAddedUseCase.js';
import { HandleExternalGroupUpdatedUseCase } from '../../application/usecases/HandleExternalGroupUpdatedUseCase.js';
import { HandleExternalGroupDeletedUseCase } from '../../application/usecases/HandleExternalGroupDeletedUseCase.js';
import { HandleExternalTimeAllocationAddedUseCase } from '../../application/usecases/HandleExternalTimeAllocationAddedUseCase.js';
import { HandleExternalTimeAllocationUpdatedUseCase } from '../../application/usecases/HandleExternalTimeAllocationUpdatedUseCase.js';
import { HandleExternalTimeAllocationDeletedUseCase } from '../../application/usecases/HandleExternalTimeAllocationDeletedUseCase.js';
import { InstallAppUseCase } from '../../application/usecases/InstallAppUseCase.js';
import { HandleAppInstalledUseCase } from '../../application/usecases/HandleAppInstalledUseCase.js';
import { LoginWithOauthProviderUseCase } from '../../application/usecases/LoginWithOauthProviderUseCase.js';
import { RefreshAccessTokenUseCase } from '../../application/usecases/RefreshAccessTokenUseCase.js';
import { EnsureTenantAuthValidityUseCase } from '../../application/usecases/EnsureTenantAuthValidityUseCase.js';
import { SendNotificationsUseCase } from '../../application/usecases/SendNotificationsUseCase.js';
import { GetCurrentUserUseCase } from '../../application/usecases/GetCurrentUserUseCase.js';
import { GetDepartmentUsersUseCase } from '../../application/usecases/GetDepartmentUsersUseCase.js';
import { GetGroupsUseCase } from '../../application/usecases/GetGroupsUseCase.js';
import { GetTasksUseCase } from '../../application/usecases/GetTasksUseCase.js';
import { GetUsersUseCase } from '../../application/usecases/GetUsersUseCase.js';
import { GetDepartmentsUseCase } from '../../application/usecases/GetDepartmentsUseCase.js';
import { AddTimeAllocationUseCase } from '../../application/usecases/AddTimeAllocationUseCase.js';
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
import type { GroupRepository } from '../../application/ports/GroupRepository.js';
import type { UserProvider } from '../../application/ports/UserProvider.js';
import type { OauthProvider } from '../../application/ports/OauthProvider.js';
import type { SmartProcessProvider } from '../../application/ports/SmartProcessProvider.js';
import type { SmartProcessRepository } from '../../application/ports/SmartProcessRepository.js';
import type { SmartProcessFieldProvider } from '../../application/ports/SmartProcessFieldProvider.js';
import type { TaskProvider } from '../../application/ports/TaskProvider.js';
import type { TaskRepository } from '../../application/ports/TaskRepository.js';
import type { TimeAllocationSmartProcessProvider } from '../../application/ports/TimeAllocationSmartProcessProvider.js';
import type { TimeAllocationRepository } from '../../application/ports/TimeAllocationRepository.js';
import type { EntityProvider } from '../../application/ports/EntityProvider.js';
import type { TokenIssuer } from '../../application/ports/TokenIssuer.js';
import type { SessionRepository } from '../../application/ports/SessionRepository.js';
import type { TokenVerifier } from '../../application/ports/TokenVerifier.js';
import type { TransactionRunner } from '../../application/ports/TransactionRunner.js';
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
import { PrismaGroupRepository } from '../out/persistence/repositories/PrismaGroupRepository.js';
import { PrismaTaskRepository } from '../out/persistence/repositories/PrismaTaskRepository.js';
import { PrismaTimeAllocationRepository } from '../out/persistence/repositories/PrismaTimeAllocationRepository.js';
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
import { TimeAllocationPolicy } from '../../domain/time-allocation/TimeAllocationPolicy.js';

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
      provide: DispatchIncomingWebhookUseCase,
      useFactory: (
        eventProcessors: Record<string, EventHandlerUseCase>,
        userProvider: UserProvider,
        ensureTenantAuthValidityUseCase: EnsureTenantAuthValidityUseCase,
      ) => {
        return new DispatchIncomingWebhookUseCase(
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
      provide: HandleExternalUserAddedUseCase,
      useFactory: (
        userProvider: UserProvider,
        userRepository: UserRepository,
        roleRepository: RoleRepository,
      ) => {
        return new HandleExternalUserAddedUseCase(
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
      provide: HandleExternalTaskAddedUseCase,
      useFactory: (
        taskProvider: TaskProvider,
        taskRepository: TaskRepository,
      ) => {
        return new HandleExternalTaskAddedUseCase(
          taskProvider,
          taskRepository,
        );
      },
      inject: [BitrixTaskProvider, PrismaTaskRepository],
    },
    {
      provide: HandleExternalTaskUpdatedUseCase,
      useFactory: (
        taskProvider: TaskProvider,
        taskRepository: TaskRepository,
      ) => {
        return new HandleExternalTaskUpdatedUseCase(
          taskProvider,
          taskRepository,
        );
      },
      inject: [BitrixTaskProvider, PrismaTaskRepository],
    },
    {
      provide: HandleExternalTaskDeletedUseCase,
      useFactory: (taskRepository: TaskRepository) => {
        return new HandleExternalTaskDeletedUseCase(
          taskRepository,
        );
      },
      inject: [PrismaTaskRepository],
    },
    {
      provide: HandleExternalGroupAddedUseCase,
      useFactory: (
        groupProvider: GroupProvider,
        groupRepository: GroupRepository,
      ) => {
        return new HandleExternalGroupAddedUseCase(
          groupProvider,
          groupRepository,
        );
      },
      inject: [BitrixGroupProvider, PrismaGroupRepository],
    },
    {
      provide: HandleExternalGroupUpdatedUseCase,
      useFactory: (
        groupProvider: GroupProvider,
        groupRepository: GroupRepository,
      ) => {
        return new HandleExternalGroupUpdatedUseCase(
          groupProvider,
          groupRepository,
        );
      },
      inject: [BitrixGroupProvider, PrismaGroupRepository],
    },
    {
      provide: HandleExternalGroupDeletedUseCase,
      useFactory: (groupRepository: GroupRepository) => {
        return new HandleExternalGroupDeletedUseCase(
          groupRepository,
        );
      },
      inject: [PrismaGroupRepository],
    },
    {
      provide: HandleExternalTimeAllocationAddedUseCase,
      useFactory: (
        smartProcessRepository: SmartProcessRepository,
        timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
        timeAllocationRepository: TimeAllocationRepository,
        taskRepository: TaskRepository,
        groupRepository: GroupRepository,
        userRepository: UserRepository,
        taskProvider: TaskProvider,
        groupProvider: GroupProvider,
        userProvider: UserProvider,
        roleRepository: RoleRepository,
        transactionRunner: TransactionRunner,
      ) => {
        return new HandleExternalTimeAllocationAddedUseCase(
          smartProcessRepository,
          timeAllocationSmartProcessProvider,
          timeAllocationRepository,
          taskRepository,
          groupRepository,
          userRepository,
          taskProvider,
          groupProvider,
          userProvider,
          roleRepository,
          transactionRunner,
        );
      },
      inject: [
        PrismaSmartProcessRepository,
        BitrixTimeAllocationSmartProcessProvider,
        PrismaTimeAllocationRepository,
        PrismaTaskRepository,
        PrismaGroupRepository,
        PrismaUserRepository,
        BitrixTaskProvider,
        BitrixGroupProvider,
        BitrixUserProvider,
        PrismaRoleRepository,
        PrismaTransactionRunner,
      ],
    },
    {
      provide: HandleExternalTimeAllocationUpdatedUseCase,
      useFactory: (
        smartProcessRepository: SmartProcessRepository,
        timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
        timeAllocationRepository: TimeAllocationRepository,
        taskRepository: TaskRepository,
        groupRepository: GroupRepository,
        userRepository: UserRepository,
        taskProvider: TaskProvider,
        groupProvider: GroupProvider,
        userProvider: UserProvider,
        roleRepository: RoleRepository,
        transactionRunner: TransactionRunner,
      ) => {
        return new HandleExternalTimeAllocationUpdatedUseCase(
          smartProcessRepository,
          timeAllocationSmartProcessProvider,
          timeAllocationRepository,
          taskRepository,
          groupRepository,
          userRepository,
          taskProvider,
          groupProvider,
          userProvider,
          roleRepository,
          transactionRunner,
        );
      },
      inject: [
        PrismaSmartProcessRepository,
        BitrixTimeAllocationSmartProcessProvider,
        PrismaTimeAllocationRepository,
        PrismaTaskRepository,
        PrismaGroupRepository,
        PrismaUserRepository,
        BitrixTaskProvider,
        BitrixGroupProvider,
        BitrixUserProvider,
        PrismaRoleRepository,
        PrismaTransactionRunner,
      ],
    },
    {
      provide: HandleExternalTimeAllocationDeletedUseCase,
      useFactory: (
        smartProcessRepository: SmartProcessRepository,
        timeAllocationRepository: TimeAllocationRepository,
      ) => {
        return new HandleExternalTimeAllocationDeletedUseCase(
          smartProcessRepository,
          timeAllocationRepository,
        );
      },
      inject: [
        PrismaSmartProcessRepository,
        PrismaTimeAllocationRepository,
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
        groupRepository: GroupRepository,
        smartProcessRepository: SmartProcessRepository,
        smartProcessProvider: SmartProcessProvider,
        smartProcessFieldProvider: SmartProcessFieldProvider,
        groupProvider: GroupProvider,
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
          groupRepository,
          smartProcessRepository,
          smartProcessProvider,
          smartProcessFieldProvider,
          groupProvider,
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
        PrismaGroupRepository,
        PrismaSmartProcessRepository,
        BitrixSmartProcessProvider,
        BitrixSmartProcessFieldProvider,
        BitrixGroupProvider,
        BitrixEntityProvider,
        PrismaTransactionRunner,
        NestConsoleLogger,
      ],
    },
    {
      provide: HandleAppInstalledUseCase,
      useFactory: (
        tenantRepository: TenantRepository,
        logger: Logger,
      ) => {
        return new HandleAppInstalledUseCase(
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
      provide: GetGroupsUseCase,
      useFactory: (
        groupRepository: GroupRepository,
        tenantRepository: TenantRepository,
      ) => {
        return new GetGroupsUseCase(
          groupRepository,
          tenantRepository,
        );
      },
      inject: [PrismaGroupRepository, PrismaTenantRepository],
    },
    {
      provide: GetTasksUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ) => {
        return new GetTasksUseCase(
          taskRepository,
          tenantRepository,
        );
      },
      inject: [PrismaTaskRepository, PrismaTenantRepository],
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
      provide: AddTimeAllocationUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
        smartProcessRepository: SmartProcessRepository,
        timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
        timeAllocationRepository: TimeAllocationRepository,
        taskRepository: TaskRepository,
        groupRepository: GroupRepository,
        transactionRunner: TransactionRunner,
        timeAllocationPolicy: TimeAllocationPolicy,
      ) => {
        return new AddTimeAllocationUseCase(
          userRepository,
          tenantRepository,
          smartProcessRepository,
          timeAllocationSmartProcessProvider,
          timeAllocationRepository,
          taskRepository,
          groupRepository,
          transactionRunner,
          timeAllocationPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaTenantRepository,
        PrismaSmartProcessRepository,
        BitrixTimeAllocationSmartProcessProvider,
        PrismaTimeAllocationRepository,
        PrismaTaskRepository,
        PrismaGroupRepository,
        PrismaTransactionRunner,
        TimeAllocationPolicy,
      ],
    },
    {
      provide: GetTimeAllocationsUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
        smartProcessRepository: SmartProcessRepository,
        timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
        taskProvider: TaskProvider,
        groupProvider: GroupProvider,
        timeAllocationPolicy: TimeAllocationPolicy,
      ) => {
        return new GetTimeAllocationsUseCase(
          userRepository,
          tenantRepository,
          smartProcessRepository,
          timeAllocationSmartProcessProvider,
          taskProvider,
          groupProvider,
          timeAllocationPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaTenantRepository,
        PrismaSmartProcessRepository,
        BitrixTimeAllocationSmartProcessProvider,
        BitrixTaskProvider,
        BitrixGroupProvider,
        TimeAllocationPolicy,
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
    TimeAllocationPolicy,
    {
      provide: EVENT_PROCESSORS,
      useFactory: (
        handleExternalUserAddedUseCase: HandleExternalUserAddedUseCase,
        handleAppInstalledUseCase: HandleAppInstalledUseCase,
        handleExternalTaskAddedUseCase: HandleExternalTaskAddedUseCase,
        handleExternalTaskUpdatedUseCase: HandleExternalTaskUpdatedUseCase,
        handleExternalTaskDeletedUseCase: HandleExternalTaskDeletedUseCase,
        handleExternalGroupAddedUseCase: HandleExternalGroupAddedUseCase,
        handleExternalGroupUpdatedUseCase: HandleExternalGroupUpdatedUseCase,
        handleExternalGroupDeletedUseCase: HandleExternalGroupDeletedUseCase,
        handleExternalTimeAllocationAddedUseCase: HandleExternalTimeAllocationAddedUseCase,
        handleExternalTimeAllocationUpdatedUseCase: HandleExternalTimeAllocationUpdatedUseCase,
        handleExternalTimeAllocationDeletedUseCase: HandleExternalTimeAllocationDeletedUseCase,
      ) => ({
        ONUSERADD: handleExternalUserAddedUseCase,
        ONAPPINSTALL: handleAppInstalledUseCase,
        ONTASKADD: handleExternalTaskAddedUseCase,
        ONTASKUPDATE: handleExternalTaskUpdatedUseCase,
        ONTASKDELETE: handleExternalTaskDeletedUseCase,
        ONSONETGROUPADD: handleExternalGroupAddedUseCase,
        ONSONETGROUPUPDATE: handleExternalGroupUpdatedUseCase,
        ONSONETGROUPDELETE: handleExternalGroupDeletedUseCase,
        ONCRMDYNAMICITEMADD:
          handleExternalTimeAllocationAddedUseCase,
        ONCRMDYNAMICITEMUPDATE:
          handleExternalTimeAllocationUpdatedUseCase,
        ONCRMDYNAMICITEMDELETE:
          handleExternalTimeAllocationDeletedUseCase,
      }),
      inject: [
        HandleExternalUserAddedUseCase,
        HandleAppInstalledUseCase,
        HandleExternalTaskAddedUseCase,
        HandleExternalTaskUpdatedUseCase,
        HandleExternalTaskDeletedUseCase,
        HandleExternalGroupAddedUseCase,
        HandleExternalGroupUpdatedUseCase,
        HandleExternalGroupDeletedUseCase,
        HandleExternalTimeAllocationAddedUseCase,
        HandleExternalTimeAllocationUpdatedUseCase,
        HandleExternalTimeAllocationDeletedUseCase,
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
    DispatchIncomingWebhookUseCase,
    InstallAppUseCase,
    HandleExternalUserAddedUseCase,
    LoginWithOauthProviderUseCase,
    RefreshAccessTokenUseCase,
    EnsureTenantAuthValidityUseCase,
    SendNotificationsUseCase,
    GetDepartmentsUseCase,
    GetDepartmentUsersUseCase,
    GetGroupsUseCase,
    GetTasksUseCase,
    GetUsersUseCase,
    AddTimeAllocationUseCase,
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
