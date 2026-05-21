import { PaymentProvider } from '../../domain/subscription/PaymentProvider.js';
import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionInvoice } from '../../domain/subscription/SubscriptionInvoice.js';
import { SubscriptionStatus } from '../../domain/subscription/SubscriptionStatus.js';
import type { IdGenerator } from '../ports/IdGenerator.js';
import type { PaymentProviderResolver } from '../ports/PaymentProviderResolver.js';
import type { PlanRepository } from '../ports/PlanRepository.js';
import type { SubscriptionInvoiceRepository } from '../ports/SubscriptionInvoiceRepository.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface CreateSubscriptionInvoiceCommand {
  initiatorUserId: string;
  planId: string;
  provider: PaymentProvider;
}

export interface CreateSubscriptionInvoiceResult {
  data: {
    invoice: SubscriptionInvoice;
  };
}

export class CreateSubscriptionInvoiceUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionInvoiceRepository: SubscriptionInvoiceRepository,
    private readonly paymentProviderResolver: PaymentProviderResolver,
    private readonly idGenerator: IdGenerator,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: CreateSubscriptionInvoiceCommand,
  ): Promise<CreateSubscriptionInvoiceResult> {
    const customer = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
    });

    const plan = await this.planRepository.loadOrThrow({
      filters: {
        id: command.planId,
      },
    });

    const paymentProvider = this.paymentProviderResolver.resolve(
      command.provider,
    );

    const subscriptionId = this.idGenerator.generate();
    const invoiceId = this.idGenerator.generate();

    const planTranslation = plan.getTranslation(
      customer.language,
    );

    const planName = planTranslation?.name ?? plan.code;

    const externalPayment = await paymentProvider.create({
      invoiceId,
      description: planName,
      priceAmount: plan.priceAmount,
      priceCurrency: plan.priceCurrency,
    });

    const preparedSubscription = Subscription.create({
      id: subscriptionId,
      userId: customer.id,
      planId: plan.id,
      status: SubscriptionStatus.Incomplete,
      startedAt: new Date(),
    });

    const preparedInvoice = SubscriptionInvoice.create({
      id: invoiceId,
      subscriptionId,
      userId: customer.id,
      status: externalPayment.status,
      amountDue: plan.priceAmount,
      currency: plan.priceCurrency,
      provider: command.provider,
      providerInvoiceId: externalPayment.externalId,
      checkoutUrl: externalPayment.checkoutUrl,
    });

    const savedInvoice = await this.transactionRunner.run(
      async (transactionContext) => {
        await this.subscriptionRepository.save(
          preparedSubscription,
          transactionContext,
        );

        return this.subscriptionInvoiceRepository.save(
          preparedInvoice,
          transactionContext,
        );
      },
    );

    return {
      data: {
        invoice: savedInvoice,
      },
    };
  }
}
