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
import { CreatePlanUseCase } from '../../application/usecases/CreatePlanUseCase.js';
import { GetPlanUseCase } from '../../application/usecases/GetPlanUseCase.js';
import { GetPlansUseCase } from '../../application/usecases/GetPlansUseCase.js';
import { CreateSubscriptionCheckoutUseCase } from '../../application/usecases/CreateSubscriptionCheckoutUseCase.js';
import { GetSubscriptionUseCase } from '../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionsUseCase } from '../../application/usecases/GetSubscriptionsUseCase.js';
import type { NotificationService } from '../../application/ports/NotificationService.js';

import type { UserRepository } from '../../application/ports/UserRepository.js';

import type { RoleRepository } from '../../application/ports/RoleRepository.js';

import type { AccessTokenService } from '../../application/ports/AccessTokenService.js';
import type { MagicLinkTokenService } from '../../application/ports/MagicLinkTokenService.js';
import type { RefreshTokenService } from '../../application/ports/RefreshTokenService.js';
import type { SessionRepository } from '../../application/ports/SessionRepository.js';
import type { AuthTokenRepository } from '../../application/ports/AuthTokenRepository.js';
import type { TransactionRunner } from '../../application/ports/TransactionRunner.js';
import type { PlanRepository } from '../../application/ports/PlanRepository.js';
import type { SubscriptionRepository } from '../../application/ports/SubscriptionRepository.js';
import type { SubscriptionCheckoutRepository } from '../../application/ports/SubscriptionCheckoutRepository.js';
import type { PaymentProviderResolver } from '../../application/ports/PaymentProviderResolver.js';
import type { SubscriptionCheckoutStatusMapper } from '../../application/ports/SubscriptionCheckoutStatusMapper.js';
import { PersistenceModule } from '../out/persistence/PersistenceModule.js';
import { LoggingWiringModule } from '../out/logging/LoggingWiringModule.js';
import { AuthModule } from '../out/auth/AuthModule.js';
import { NotificationModule } from '../out/notification/NotificationModule.js';
import { PaymentModule } from '../out/payment/PaymentModule.js';
import { NestConsoleLogger } from '../out/logging/loggers/NestConsoleLogger.js';
import { PrismaUserRepository } from '../out/persistence/repositories/PrismaUserRepository.js';
import { PrismaRoleRepository } from '../out/persistence/repositories/PrismaRoleRepository.js';
import { PrismaSessionRepository } from '../out/persistence/repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from '../out/persistence/repositories/PrismaAuthTokenRepository.js';
import { PrismaPlanRepository } from '../out/persistence/repositories/PrismaPlanRepository.js';
import { PrismaSubscriptionRepository } from '../out/persistence/repositories/PrismaSubscriptionRepository.js';
import { PrismaSubscriptionCheckoutRepository } from '../out/persistence/repositories/PrismaSubscriptionCheckoutRepository.js';
import { CryptoMagicLinkTokenService } from '../out/auth/services/CryptoMagicLinkTokenService.js';
import { JwtAccessTokenService } from '../out/auth/services/JwtAccessTokenService.js';
import { JwtRefreshTokenService } from '../out/auth/services/JwtRefreshTokenService.js';
import { EmailNotificationService } from '../out/notification/services/EmailNotificationService.js';
import { CryptoIdGenerator } from '../out/identity/generators/CryptoIdGenerator.js';
import { DefaultSubscriptionCheckoutStatusMapper } from '../out/payment/mappers/DefaultSubscriptionCheckoutStatusMapper.js';
import { NowPaymentsPaymentProvider } from '../out/payment/providers/NowPaymentsPaymentProvider.js';
import { DefaultPaymentProviderResolver } from '../out/payment/resolvers/DefaultPaymentProviderResolver.js';
import { PlanPolicy } from '../../domain/subscription/PlanPolicy.js';
import { SubscriptionPolicy } from '../../domain/subscription/SubscriptionPolicy.js';
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
    PaymentModule,
  ],
  providers: [
    CryptoIdGenerator,
    DefaultSubscriptionCheckoutStatusMapper,
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
        roleRepository: RoleRepository,
        accessTokenService: AccessTokenService,
        magicLinkTokenService: MagicLinkTokenService,
        idGenerator: CryptoIdGenerator,
        refreshTokenService: RefreshTokenService,
        sessionRepository: SessionRepository,
      ) => {
        return new LoginWithMagicLinkUseCase(
          authTokenRepository,
          userRepository,
          roleRepository,
          accessTokenService,
          magicLinkTokenService,
          idGenerator,
          refreshTokenService,
          sessionRepository,
        );
      },
      inject: [
        PrismaAuthTokenRepository,
        PrismaUserRepository,
        PrismaRoleRepository,
        JwtAccessTokenService,
        CryptoMagicLinkTokenService,
        CryptoIdGenerator,
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
    {
      provide: GetPlansUseCase,
      useFactory: (
        userRepository: UserRepository,
        planRepository: PlanRepository,
        planPolicy: PlanPolicy,
      ) => {
        return new GetPlansUseCase(
          userRepository,
          planRepository,
          planPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaPlanRepository,
        PlanPolicy,
      ],
    },
    {
      provide: GetPlanUseCase,
      useFactory: (
        userRepository: UserRepository,
        planRepository: PlanRepository,
        planPolicy: PlanPolicy,
      ) => {
        return new GetPlanUseCase(
          userRepository,
          planRepository,
          planPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaPlanRepository,
        PlanPolicy,
      ],
    },
    {
      provide: CreatePlanUseCase,
      useFactory: (
        userRepository: UserRepository,
        planRepository: PlanRepository,
        planPolicy: PlanPolicy,
      ) => {
        return new CreatePlanUseCase(
          userRepository,
          planRepository,
          planPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaPlanRepository,
        PlanPolicy,
      ],
    },
    {
      provide: CreateSubscriptionCheckoutUseCase,
      useFactory: (
        userRepository: UserRepository,
        planRepository: PlanRepository,
        subscriptionCheckoutRepository: SubscriptionCheckoutRepository,
        paymentProviderResolver: PaymentProviderResolver,
        subscriptionCheckoutStatusMapper: SubscriptionCheckoutStatusMapper,
        idGenerator: CryptoIdGenerator,
      ) => {
        return new CreateSubscriptionCheckoutUseCase(
          userRepository,
          planRepository,
          subscriptionCheckoutRepository,
          paymentProviderResolver,
          subscriptionCheckoutStatusMapper,
          idGenerator,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaPlanRepository,
        PrismaSubscriptionCheckoutRepository,
        DefaultPaymentProviderResolver,
        DefaultSubscriptionCheckoutStatusMapper,
        CryptoIdGenerator,
      ],
    },
    {
      provide: GetSubscriptionsUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository,
        subscriptionPolicy: SubscriptionPolicy,
      ) => {
        return new GetSubscriptionsUseCase(
          userRepository,
          subscriptionRepository,
          subscriptionPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionRepository,
        SubscriptionPolicy,
      ],
    },
    {
      provide: GetSubscriptionUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository,
        subscriptionPolicy: SubscriptionPolicy,
      ) => {
        return new GetSubscriptionUseCase(
          userRepository,
          subscriptionRepository,
          subscriptionPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionRepository,
        SubscriptionPolicy,
      ],
    },
    RolePolicy,
    PlanPolicy,
    SubscriptionPolicy,
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
    GetPlansUseCase,
    GetPlanUseCase,
    CreatePlanUseCase,
    CreateSubscriptionCheckoutUseCase,
    GetSubscriptionsUseCase,
    GetSubscriptionUseCase,
  ],
})
export class UseCaseModule {}
