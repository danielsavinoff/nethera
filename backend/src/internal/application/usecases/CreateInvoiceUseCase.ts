import { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import { InvoiceStatus } from '../../domain/subscription/InvoiceStatus.js';
import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionStatus } from '../../domain/subscription/SubscriptionStatus.js';
import { SubscriptionPriceNotFoundException } from '../exceptions/SubscriptionPriceNotFoundException.js';
import type { IdGenerator } from '../ports/IdGenerator.js';
import type { InvoiceRepository } from '../ports/InvoiceRepository.js';
import type { InvoiceProviderResolver } from '../ports/InvoiceProviderResolver.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { UserRepository } from '../ports/UserRepository.js';
import { Money } from '../../domain/money/Money.js';
import { InvoiceLine } from '../../domain/subscription/InvoiceLine.js';
import { InvoiceLineType } from '../../domain/subscription/InvoiceLineType.js';

export interface CreateInvoiceCommand {
  initiatorUserId: string;
  subscriptionPlanId: string;
  provider: BillingProvider;
}

export interface CreateInvoiceResult {
  data: {
    invoice: Invoice;
  };
}

export class CreateInvoiceUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceProviderResolver: InvoiceProviderResolver,
    private readonly idGenerator: IdGenerator,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: CreateInvoiceCommand,
  ): Promise<CreateInvoiceResult> {
    const customer = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
    });

    const subscriptionPlan =
      await this.subscriptionPlanRepository.loadOrThrow({
        filters: {
          id: command.subscriptionPlanId,
        },
      });

    const invoiceProvider = this.invoiceProviderResolver.resolve(
      command.provider,
    );

    const subscriptionId = this.idGenerator.generate();
    const invoiceId = this.idGenerator.generate();

    const planTranslation = subscriptionPlan.getTranslation(
      customer.language,
    );

    const planName =
      planTranslation?.name ?? subscriptionPlan.code;

    const subscriptionPrice = subscriptionPlan.getActivePrice();

    if (!subscriptionPrice) {
      throw new SubscriptionPriceNotFoundException();
    }

    const externalInvoice = await invoiceProvider.create({
      invoiceId,
      description: planName,
      amount: Money.fromMinor(
        subscriptionPrice.amountMinor,
        subscriptionPrice.currency,
      ),
      currency: subscriptionPrice.currency,
    });

    const preparedSubscription = Subscription.create({
      id: subscriptionId,
      userId: customer.id,
      subscriptionPlanId: subscriptionPlan.id,
      status: SubscriptionStatus.Incomplete,
      startedAt: new Date(),
    });

    const preparedInvoice = Invoice.create({
      id: invoiceId,
      externalId: externalInvoice.externalId,
      provider: command.provider,
      userId: customer.id,
      status: externalInvoice.status ?? InvoiceStatus.Pending,
      totalAmountMinor: Money.toMinor(
        externalInvoice.amount,
        externalInvoice.currency,
      ),
      amountPaidMinor: 0,
      currency: externalInvoice.currency,
      externalCheckoutUrl: externalInvoice.externalCheckoutUrl,
      expiresAt: externalInvoice.expiresAt,
    }).withLines([
      InvoiceLine.create({
        id: this.idGenerator.generate(),
        invoiceId,
        referenceId: subscriptionId,
        type: InvoiceLineType.Subscription,
        amount: subscriptionPrice.amountMinor,
      }),
    ]);

    const savedInvoice = await this.transactionRunner.run(
      async (transactionContext) => {
        await this.subscriptionRepository.save(
          preparedSubscription,
          transactionContext,
        );

        const invoice = await this.invoiceRepository.save(
          preparedInvoice,
          transactionContext,
        );

        return invoice;
      },
    );

    return {
      data: {
        invoice: savedInvoice,
      },
    };
  }
}
