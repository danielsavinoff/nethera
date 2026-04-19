import { Module } from '@nestjs/common';
import type { Logger } from '../../domain/logging/Logger.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import { DispatchIncomingWebhookUseCase } from '../../application/usecases/DispatchIncomingWebhookUseCase.js';
import type { EventHandlerUseCase } from '../../application/usecases/DispatchIncomingWebhookUseCase.js';
import { LoginWithMagicLinkUseCase } from '../../application/usecases/LoginWithMagicLinkUseCase.js';
import { RefreshAccessTokenUseCase } from '../../application/usecases/RefreshAccessTokenUseCase.js';
import { SendMagicLinkUseCase } from '../../application/usecases/SendMagicLinkUseCase.js';
import { GetCurrentUserUseCase } from '../../application/usecases/GetCurrentUserUseCase.js';
import { GetUsersUseCase } from '../../application/usecases/GetUsersUseCase.js';
import { GetRolesUseCase } from '../../application/usecases/GetRolesUseCase.js';
import { GetUserRolesUseCase } from '../../application/usecases/GetUserRolesUseCase.js';
import { AddUserRoleUseCase } from '../../application/usecases/AddUserRoleUseCase.js';
import { DeleteUserRoleUseCase } from '../../application/usecases/DeleteUserRoleUseCase.js';
import { NotificationChannel } from '../../application/models/Notification.js';
import type { NotificationComposer } from '../../application/ports/NotificationComposer.js';
import type { NotificationService } from '../../application/ports/NotificationService.js';

import type { UserRepository } from '../../application/ports/UserRepository.js';

import type { RoleRepository } from '../../application/ports/RoleRepository.js';

import type { AccessTokenService } from '../../application/ports/AccessTokenService.js';
import type { MagicLinkTokenService } from '../../application/ports/MagicLinkTokenService.js';
import type { RefreshTokenService } from '../../application/ports/RefreshTokenService.js';
import type { SessionRepository } from '../../application/ports/SessionRepository.js';
import type { AuthTokenRepository } from '../../application/ports/AuthTokenRepository.js';
import type { TransactionRunner } from '../../application/ports/TransactionRunner.js';
import { PersistenceModule } from '../out/persistence/PersistenceModule.js';
import { LoggingWiringModule } from '../out/logging/LoggingWiringModule.js';
import { AuthModule } from '../out/auth/AuthModule.js';
import { NotificationModule } from '../out/notification/NotificationModule.js';
import { NestConsoleLogger } from '../out/logging/loggers/NestConsoleLogger.js';
import { PrismaUserRepository } from '../out/persistence/repositories/PrismaUserRepository.js';
import { PrismaRoleRepository } from '../out/persistence/repositories/PrismaRoleRepository.js';
import { PrismaSessionRepository } from '../out/persistence/repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from '../out/persistence/repositories/PrismaAuthTokenRepository.js';
import { CryptoMagicLinkTokenService } from '../out/auth/services/CryptoMagicLinkTokenService.js';
import { JwtAccessTokenService } from '../out/auth/services/JwtAccessTokenService.js';
import { JwtRefreshTokenService } from '../out/auth/services/JwtRefreshTokenService.js';
import { EmailNotificationService } from '../out/notification/services/EmailNotificationService.js';
import { UserFavoritePolicy } from '../../domain/user/UserFavoritePolicy.js';
import { NotificationComposerSelector } from '../../application/ports/NotificationComposerSelector.js';
import { DefaultNotificationComposerSelector } from '../out/notification/selectors/DefaultNotificationComposerSelector.js';

const NOTIFICATION_CHANNELS = Symbol('NOTIFICATION_CHANNELS');
const EVENT_PROCESSORS = Symbol('EVENT_PROCESSORS');

@Module({
  imports: [
    PersistenceModule,
    LoggingWiringModule,
    AuthModule,
    NotificationModule,
  ],
  providers: [
    // {
    //   provide: DispatchIncomingWebhookUseCase,
    //   useFactory: (
    //     eventProcessors: Record<string, EventHandlerUseCase>,
    //     userProvider: UserProvider,
    //     ensureTenantAuthValidityUseCase: EnsureTenantAuthValidityUseCase,
    //   ) => {
    //     return new DispatchIncomingWebhookUseCase(
    //       eventProcessors,
    //       userProvider,
    //       ensureTenantAuthValidityUseCase,
    //     );
    //   },
    //   inject: [
    //     EVENT_PROCESSORS,
    //     BitrixUserProvider,
    //     EnsureTenantAuthValidityUseCase,
    //   ],
    // },

    {
      provide: SendMagicLinkUseCase,
      useFactory: (
        authTokenRepository: AuthTokenRepository,
        notificationComposerSelector: NotificationComposerSelector,
        notificationService: NotificationService,
        magicLinkTokenService: MagicLinkTokenService,
      ) => {
        return new SendMagicLinkUseCase(
          authTokenRepository,
          notificationComposerSelector,
          notificationService,
          magicLinkTokenService,
        );
      },
      inject: [
        PrismaAuthTokenRepository,
        DefaultNotificationComposerSelector,
        EmailNotificationService,
        CryptoMagicLinkTokenService,
      ],
    },
    {
      provide: LoginWithMagicLinkUseCase,
      useFactory: (
        authTokenRepository: AuthTokenRepository,
        userRepository: UserRepository,
        accessTokenService: AccessTokenService,
        magicLinkTokenService: MagicLinkTokenService,
        refreshTokenService: RefreshTokenService,
        sessionRepository: SessionRepository,
      ) => {
        return new LoginWithMagicLinkUseCase(
          authTokenRepository,
          userRepository,
          accessTokenService,
          magicLinkTokenService,
          refreshTokenService,
          sessionRepository,
        );
      },
      inject: [
        PrismaAuthTokenRepository,
        PrismaUserRepository,
        JwtAccessTokenService,
        CryptoMagicLinkTokenService,
        JwtRefreshTokenService,
        PrismaSessionRepository,
      ],
    },
    {
      provide: RefreshAccessTokenUseCase,
      useFactory: (
        userRepository: UserRepository,
        sessionRepository: SessionRepository,
        accessTokenService: AccessTokenService,
        refreshTokenService: RefreshTokenService,
      ) => {
        return new RefreshAccessTokenUseCase(
          userRepository,
          sessionRepository,
          accessTokenService,
          refreshTokenService,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSessionRepository,
        JwtAccessTokenService,
        JwtRefreshTokenService,
      ],
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
    UserFavoritePolicy,
    RolePolicy,
    {
      provide: EVENT_PROCESSORS,
      useFactory: () => ({}),
      inject: [],
    },
    {
      provide: NOTIFICATION_CHANNELS,
      useFactory: (
        NotificationService: NotificationService,
      ) => ({}),
      inject: [],
    },
  ],
  exports: [
    // DispatchIncomingWebhookUseCase,
    SendMagicLinkUseCase,
    LoginWithMagicLinkUseCase,
    RefreshAccessTokenUseCase,
    GetUsersUseCase,
    GetCurrentUserUseCase,
    GetRolesUseCase,
    GetUserRolesUseCase,
    AddUserRoleUseCase,
    DeleteUserRoleUseCase,
  ],
})
export class UseCaseModule {}
