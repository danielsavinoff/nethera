import { Module } from '@nestjs/common';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';

import { LoginWithMagicLinkUseCase } from '../../application/usecases/LoginWithMagicLinkUseCase.js';
import { LogoutUseCase } from '../../application/usecases/LogoutUseCase.js';
import { RefreshAccessTokenUseCase } from '../../application/usecases/RefreshAccessTokenUseCase.js';
import { SendMagicLinkUseCase } from '../../application/usecases/SendMagicLinkUseCase.js';
import { GetCurrentUserUseCase } from '../../application/usecases/GetCurrentUserUseCase.js';
import { GetUsersUseCase } from '../../application/usecases/GetUsersUseCase.js';
import { DeleteAccountUseCase } from '../../application/usecases/DeleteAccountUseCase.js';
import { UpdateCurrentUserLocaleUseCase } from '../../application/usecases/UpdateCurrentUserLocaleUseCase.js';
import { UpdateCurrentUserCurrencyUseCase } from '../../application/usecases/UpdateCurrentUserCurrencyUseCase.js';
import { GetRolesUseCase } from '../../application/usecases/GetRolesUseCase.js';
import { GetUserRolesUseCase } from '../../application/usecases/GetUserRolesUseCase.js';
import { AddUserRoleUseCase } from '../../application/usecases/AddUserRoleUseCase.js';
import { DeleteUserRoleUseCase } from '../../application/usecases/DeleteUserRoleUseCase.js';
import { CreateSubscriptionPlanUseCase } from '../../application/usecases/CreateSubscriptionPlanUseCase.js';
import { GetSubscriptionPlanUseCase } from '../../application/usecases/GetSubscriptionPlanUseCase.js';
import { GetSubscriptionPlansUseCase } from '../../application/usecases/GetSubscriptionPlansUseCase.js';
import { CreateInvoiceUseCase } from '../../application/usecases/CreateInvoiceUseCase.js';
import { GetInvoiceUseCase } from '../../application/usecases/GetInvoiceUseCase.js';
import { GetInvoiceLinesUseCase } from '../../application/usecases/GetInvoiceLinesUseCase.js';
import { GetInvoicesUseCase } from '../../application/usecases/GetInvoicesUseCase.js';
import { GetBillingProvidersUseCase } from '../../application/usecases/GetBillingProvidersUseCase.js';
import { GetSupportedCurrenciesUseCase } from '../../application/usecases/GetSupportedCurrenciesUseCase.js';
import { GetCurrentVpnSubscriptionUseCase } from '../../application/usecases/GetCurrentVpnSubscriptionUseCase.js';
import { GetCurrentVpnSubscriptionUsageUseCase } from '../../application/usecases/GetCurrentVpnSubscriptionUsageUseCase.js';
import { FulfillInvoiceUseCase } from '../../application/usecases/FulfillInvoiceUseCase.js';
import { GrantSubscriptionUseCase } from '../../application/usecases/GrantSubscriptionUseCase.js';
import { GetCurrentSubscriptionUseCase } from '../../application/usecases/GetCurrentSubscriptionUseCase.js';
import { GetSubscriptionUseCase } from '../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionsUseCase } from '../../application/usecases/GetSubscriptionsUseCase.js';
import { CancelSubscriptionUseCase } from '../../application/usecases/CancelSubscriptionUseCase.js';
import { ExtendSubscriptionUseCase } from '../../application/usecases/ExtendSubscriptionUseCase.js';
import { GetPaymentsUseCase } from '../../application/usecases/GetPaymentsUseCase.js';
import { HandlePaymentStatusChangeUseCase } from '../../application/usecases/HandlePaymentStatusChangeUseCase.js';
import type { NotificationService } from '../../application/ports/NotificationService.js';

import type { UserRepository } from '../../application/ports/UserRepository.js';

import type { RoleRepository } from '../../application/ports/RoleRepository.js';

import type { AccessTokenService } from '../../application/ports/AccessTokenService.js';
import type { MagicLinkTokenService } from '../../application/ports/MagicLinkTokenService.js';
import type { RefreshTokenService } from '../../application/ports/RefreshTokenService.js';
import type { SessionRepository } from '../../application/ports/SessionRepository.js';
import type { AuthTokenRepository } from '../../application/ports/AuthTokenRepository.js';
import type { TransactionRunner } from '../../application/ports/TransactionRunner.js';
import type { InvoiceRepository } from '../../application/ports/InvoiceRepository.js';
import type { InvoiceLineRepository } from '../../application/ports/InvoiceLineRepository.js';
import type { SubscriptionPlanRepository } from '../../application/ports/SubscriptionPlanRepository.js';
import type { SubscriptionRepository } from '../../application/ports/SubscriptionRepository.js';
import type { InvoiceProviderResolver } from '../../application/ports/InvoiceProviderResolver.js';
import { PersistenceModule } from '../out/persistence/PersistenceModule.js';
import { LoggingWiringModule } from '../out/logging/LoggingWiringModule.js';
import { AuthModule } from '../out/auth/AuthModule.js';
import { NotificationModule } from '../out/notification/NotificationModule.js';
import { InvoiceModule } from '../out/payment/InvoiceModule.js';
import { PrismaUserRepository } from '../out/persistence/repositories/PrismaUserRepository.js';
import { PrismaRoleRepository } from '../out/persistence/repositories/PrismaRoleRepository.js';
import { PrismaSessionRepository } from '../out/persistence/repositories/PrismaSessionRepository.js';
import { PrismaAuthTokenRepository } from '../out/persistence/repositories/PrismaAuthTokenRepository.js';
import { PrismaSubscriptionPlanRepository } from '../out/persistence/repositories/PrismaSubscriptionPlanRepository.js';
import { PrismaSubscriptionRepository } from '../out/persistence/repositories/PrismaSubscriptionRepository.js';
import { PrismaInvoiceRepository } from '../out/persistence/repositories/PrismaInvoiceRepository.js';
import { PrismaInvoiceLineRepository } from '../out/persistence/repositories/PrismaInvoiceLineRepository.js';
import { PrismaTransactionRunner } from '../out/persistence/transaction/PrismaTransactionRunner.js';
import { CryptoMagicLinkTokenService } from '../out/auth/services/CryptoMagicLinkTokenService.js';
import { JwtAccessTokenService } from '../out/auth/services/JwtAccessTokenService.js';
import { JwtRefreshTokenService } from '../out/auth/services/JwtRefreshTokenService.js';
import { EmailNotificationService } from '../out/notification/services/EmailNotificationService.js';
import { CryptoIdGenerator } from '../out/identity/generators/CryptoIdGenerator.js';
import { DefaultInvoiceProviderResolver } from '../out/payment/resolvers/DefaultInvoiceProviderResolver.js';
import { SubscriptionPlanPolicy } from '../../domain/subscription/SubscriptionPlanPolicy.js';
import { SubscriptionPolicy } from '../../domain/subscription/SubscriptionPolicy.js';
import { PaymentPolicy } from '../../domain/subscription/PaymentPolicy.js';
import { InvoicePolicy } from '../../domain/subscription/InvoicePolicy.js';
import { VpnSubscriptionPolicy } from '../../domain/subscription/VpnSubscriptionPolicy.js';
import { UserPolicy } from '../../domain/user/UserPolicy.js';
import { NotificationComposerSelector } from '../../application/ports/NotificationComposerSelector.js';
import { DefaultNotificationComposerSelector } from '../out/notification/selectors/DefaultNotificationComposerSelector.js';
import { PaymentRepository } from '../../application/ports/PaymentRepository.js';
import { PrismaPaymentRepository } from '../out/persistence/repositories/PrismaPaymentRepository.js';
import type { VpnSubscriptionProvider } from '../../application/ports/VpnSubscriptionProvider.js';
import type { VpnSubscriptionRepository } from '../../application/ports/VpnSubscriptionRepository.js';
import type { VpnUsageProvider } from '../../application/ports/VpnUsageProvider.js';
import { MessagingOutModule } from '../out/messaging/MessagingOutModule.js';
import { EventEmitterEventPublisher } from '../out/messaging/publishers/EventEmitterEventPublisher.js';
import type { EventPublisher } from '../../application/ports/EventPublisher.js';
import { VpnModule } from '../out/vpn/VpnModule.js';
import { RemnawaveVpnSubscriptionProvider } from '../out/vpn/providers/RemnawaveVpnSubscriptionProvider.js';
import { RemnawaveVpnUsageProvider } from '../out/vpn/providers/RemnawaveVpnUsageProvider.js';
import { PrismaVpnSubscriptionRepository } from '../out/persistence/repositories/PrismaVpnSubscriptionRepository.js';
import { DefaultTranslatorFactory } from '../out/i18n/translators/DefaultTranslatorFactory.js';
import type { TranslatorFactory } from '../../application/ports/Translator.js';

const NOTIFICATION_CHANNELS = Symbol('NOTIFICATION_CHANNELS');

@Module({
  imports: [
    PersistenceModule,
    LoggingWiringModule,
    AuthModule,
    NotificationModule,
    InvoiceModule,
    MessagingOutModule,
    VpnModule,
  ],
  providers: [
    CryptoIdGenerator,

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
      provide: LogoutUseCase,
      useFactory: (
        sessionRepository: SessionRepository,
        refreshTokenService: RefreshTokenService,
      ) => {
        return new LogoutUseCase(
          sessionRepository,
          refreshTokenService,
        );
      },
      inject: [PrismaSessionRepository, JwtRefreshTokenService],
    },

    {
      provide: GetUsersUseCase,
      useFactory: (
        userRepository: UserRepository,
        userPolicy: UserPolicy,
      ) => {
        return new GetUsersUseCase(userRepository, userPolicy);
      },
      inject: [PrismaUserRepository, UserPolicy],
    },

    {
      provide: GetCurrentUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetCurrentUserUseCase(userRepository);
      },
      inject: [PrismaUserRepository],
    },
    {
      provide: DeleteAccountUseCase,
      useFactory: (
        userRepository: UserRepository,
        userPolicy: UserPolicy,
      ) => {
        return new DeleteAccountUseCase(
          userRepository,
          userPolicy,
        );
      },
      inject: [PrismaUserRepository, UserPolicy],
    },
    {
      provide: UpdateCurrentUserLocaleUseCase,
      useFactory: (
        userRepository: UserRepository,
        userPolicy: UserPolicy,
      ) => {
        return new UpdateCurrentUserLocaleUseCase(
          userRepository,
          userPolicy,
        );
      },
      inject: [PrismaUserRepository, UserPolicy],
    },
    {
      provide: UpdateCurrentUserCurrencyUseCase,
      useFactory: (
        userRepository: UserRepository,
        userPolicy: UserPolicy,
      ) => {
        return new UpdateCurrentUserCurrencyUseCase(
          userRepository,
          userPolicy,
        );
      },
      inject: [PrismaUserRepository, UserPolicy],
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
      provide: GetSubscriptionPlansUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionPlanRepository: SubscriptionPlanRepository,
        subscriptionPlanPolicy: SubscriptionPlanPolicy,
      ) => {
        return new GetSubscriptionPlansUseCase(
          userRepository,
          subscriptionPlanRepository,
          subscriptionPlanPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionPlanRepository,
        SubscriptionPlanPolicy,
      ],
    },
    {
      provide: GetSubscriptionPlanUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionPlanRepository: SubscriptionPlanRepository,
        subscriptionPlanPolicy: SubscriptionPlanPolicy,
      ) => {
        return new GetSubscriptionPlanUseCase(
          userRepository,
          subscriptionPlanRepository,
          subscriptionPlanPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionPlanRepository,
        SubscriptionPlanPolicy,
      ],
    },
    {
      provide: CreateSubscriptionPlanUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionPlanRepository: SubscriptionPlanRepository,
        subscriptionPlanPolicy: SubscriptionPlanPolicy,
      ) => {
        return new CreateSubscriptionPlanUseCase(
          userRepository,
          subscriptionPlanRepository,
          subscriptionPlanPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionPlanRepository,
        SubscriptionPlanPolicy,
      ],
    },
    {
      provide: CreateInvoiceUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionPlanRepository: SubscriptionPlanRepository,
        invoiceRepository: InvoiceRepository,
        invoiceLineRepository: InvoiceLineRepository,
        invoiceProviderResolver: InvoiceProviderResolver,
        idGenerator: CryptoIdGenerator,
        transactionRunner: TransactionRunner,
        translatorFactory: TranslatorFactory,
      ) => {
        return new CreateInvoiceUseCase(
          userRepository,
          subscriptionPlanRepository,
          invoiceRepository,
          invoiceLineRepository,
          invoiceProviderResolver,
          idGenerator,
          transactionRunner,
          translatorFactory,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionPlanRepository,
        PrismaInvoiceRepository,
        PrismaInvoiceLineRepository,
        DefaultInvoiceProviderResolver,
        CryptoIdGenerator,
        PrismaTransactionRunner,
        DefaultTranslatorFactory,
      ],
    },
    {
      provide: GetBillingProvidersUseCase,
      useFactory: () => {
        return new GetBillingProvidersUseCase();
      },
      inject: [],
    },
    {
      provide: GetSupportedCurrenciesUseCase,
      useFactory: () => {
        return new GetSupportedCurrenciesUseCase();
      },
      inject: [],
    },
    {
      provide: GetInvoicesUseCase,
      useFactory: (
        userRepository: UserRepository,
        invoiceRepository: InvoiceRepository,
      ) => {
        return new GetInvoicesUseCase(
          userRepository,
          invoiceRepository,
        );
      },
      inject: [PrismaUserRepository, PrismaInvoiceRepository],
    },
    {
      provide: GetInvoiceUseCase,
      useFactory: (
        userRepository: UserRepository,
        invoiceRepository: InvoiceRepository,
        invoicePolicy: InvoicePolicy,
      ) => {
        return new GetInvoiceUseCase(
          userRepository,
          invoiceRepository,
          invoicePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaInvoiceRepository,
        InvoicePolicy,
      ],
    },
    {
      provide: GetInvoiceLinesUseCase,
      useFactory: (
        userRepository: UserRepository,
        invoiceRepository: InvoiceRepository,
        invoicePolicy: InvoicePolicy,
      ) => {
        return new GetInvoiceLinesUseCase(
          userRepository,
          invoiceRepository,
          invoicePolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaInvoiceRepository,
        InvoicePolicy,
      ],
    },
    {
      provide: GrantSubscriptionUseCase,
      useFactory: (
        subscriptionRepository: SubscriptionRepository,
        subscriptionPlanRepository: SubscriptionPlanRepository,
        vpnSubscriptionProvider: VpnSubscriptionProvider,
        vpnSubscriptionRepository: VpnSubscriptionRepository,
        idGenerator: CryptoIdGenerator,
        transactionRunner: TransactionRunner,
      ) => {
        return new GrantSubscriptionUseCase(
          subscriptionRepository,
          subscriptionPlanRepository,
          vpnSubscriptionProvider,
          vpnSubscriptionRepository,
          idGenerator,
          transactionRunner,
        );
      },
      inject: [
        PrismaSubscriptionRepository,
        PrismaSubscriptionPlanRepository,
        RemnawaveVpnSubscriptionProvider,
        PrismaVpnSubscriptionRepository,
        CryptoIdGenerator,
        PrismaTransactionRunner,
      ],
    },
    {
      provide: FulfillInvoiceUseCase,
      useFactory: (
        invoiceRepository: InvoiceRepository,
        grantSubscriptionUseCase: GrantSubscriptionUseCase,
      ) => {
        return new FulfillInvoiceUseCase(
          invoiceRepository,
          grantSubscriptionUseCase,
        );
      },
      inject: [
        PrismaInvoiceRepository,
        GrantSubscriptionUseCase,
      ],
    },
    {
      provide: HandlePaymentStatusChangeUseCase,
      useFactory: (
        invoiceRepository: InvoiceRepository,
        transactionRunner: TransactionRunner,
        paymentRepository: PaymentRepository,
        eventPublisher: EventPublisher,
      ) => {
        return new HandlePaymentStatusChangeUseCase(
          invoiceRepository,
          transactionRunner,
          paymentRepository,
          eventPublisher,
        );
      },
      inject: [
        PrismaInvoiceRepository,
        PrismaTransactionRunner,
        PrismaPaymentRepository,
        EventEmitterEventPublisher,
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
      provide: GetCurrentSubscriptionUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository,
        subscriptionPolicy: SubscriptionPolicy,
      ) => {
        return new GetCurrentSubscriptionUseCase(
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
    {
      provide: CancelSubscriptionUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository,
        vpnSubscriptionRepository: VpnSubscriptionRepository,
        vpnSubscriptionProvider: VpnSubscriptionProvider,
        subscriptionPolicy: SubscriptionPolicy,
        transactionRunner: TransactionRunner,
      ) => {
        return new CancelSubscriptionUseCase(
          userRepository,
          subscriptionRepository,
          vpnSubscriptionRepository,
          vpnSubscriptionProvider,
          subscriptionPolicy,
          transactionRunner,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionRepository,
        PrismaVpnSubscriptionRepository,
        RemnawaveVpnSubscriptionProvider,
        SubscriptionPolicy,
        PrismaTransactionRunner,
      ],
    },
    {
      provide: ExtendSubscriptionUseCase,
      useFactory: (
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository,
        createInvoiceUseCase: CreateInvoiceUseCase,
      ) => {
        return new ExtendSubscriptionUseCase(
          userRepository,
          subscriptionRepository,
          createInvoiceUseCase,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaSubscriptionRepository,
        CreateInvoiceUseCase,
      ],
    },
    {
      provide: GetPaymentsUseCase,
      useFactory: (
        userRepository: UserRepository,
        paymentRepository: PaymentRepository,
        paymentPolicy: PaymentPolicy,
      ) => {
        return new GetPaymentsUseCase(
          userRepository,
          paymentRepository,
          paymentPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaPaymentRepository,
        PaymentPolicy,
      ],
    },
    {
      provide: GetCurrentVpnSubscriptionUseCase,
      useFactory: (
        userRepository: UserRepository,
        vpnSubscriptionRepository: VpnSubscriptionRepository,
        vpnSubscriptionPolicy: VpnSubscriptionPolicy,
      ) => {
        return new GetCurrentVpnSubscriptionUseCase(
          userRepository,
          vpnSubscriptionRepository,
          vpnSubscriptionPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaVpnSubscriptionRepository,
        VpnSubscriptionPolicy,
      ],
    },
    {
      provide: GetCurrentVpnSubscriptionUsageUseCase,
      useFactory: (
        userRepository: UserRepository,
        vpnSubscriptionRepository: VpnSubscriptionRepository,
        vpnUsageProvider: VpnUsageProvider,
        vpnSubscriptionPolicy: VpnSubscriptionPolicy,
      ) => {
        return new GetCurrentVpnSubscriptionUsageUseCase(
          userRepository,
          vpnSubscriptionRepository,
          vpnUsageProvider,
          vpnSubscriptionPolicy,
        );
      },
      inject: [
        PrismaUserRepository,
        PrismaVpnSubscriptionRepository,
        RemnawaveVpnUsageProvider,
        VpnSubscriptionPolicy,
      ],
    },
    RolePolicy,
    SubscriptionPlanPolicy,
    SubscriptionPolicy,
    PaymentPolicy,
    InvoicePolicy,
    VpnSubscriptionPolicy,
    UserPolicy,
    {
      provide: NOTIFICATION_CHANNELS,
      useFactory: () => ({}),
      inject: [],
    },
  ],
  exports: [
    SendMagicLinkUseCase,
    LoginWithMagicLinkUseCase,
    RefreshAccessTokenUseCase,
    LogoutUseCase,
    GetUsersUseCase,
    GetCurrentUserUseCase,
    DeleteAccountUseCase,
    UpdateCurrentUserLocaleUseCase,
    UpdateCurrentUserCurrencyUseCase,
    GetRolesUseCase,
    GetUserRolesUseCase,
    AddUserRoleUseCase,
    DeleteUserRoleUseCase,
    GetSubscriptionPlansUseCase,
    GetSubscriptionPlanUseCase,
    CreateSubscriptionPlanUseCase,
    CreateInvoiceUseCase,
    GetBillingProvidersUseCase,
    GetSupportedCurrenciesUseCase,
    GetInvoiceUseCase,
    GetInvoicesUseCase,
    GetInvoiceLinesUseCase,
    GrantSubscriptionUseCase,
    FulfillInvoiceUseCase,
    HandlePaymentStatusChangeUseCase,
    GetSubscriptionsUseCase,
    GetCurrentSubscriptionUseCase,
    GetSubscriptionUseCase,
    CancelSubscriptionUseCase,
    ExtendSubscriptionUseCase,
    GetPaymentsUseCase,
    GetCurrentVpnSubscriptionUseCase,
    GetCurrentVpnSubscriptionUsageUseCase,
  ],
})
export class UseCaseModule {}
