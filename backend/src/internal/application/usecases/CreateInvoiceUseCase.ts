import { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import { InvoiceStatus } from '../../domain/subscription/InvoiceStatus.js';
import { InvoiceLine } from '../../domain/subscription/InvoiceLine.js';
import { InvoiceLineType } from '../../domain/subscription/InvoiceLineType.js';
import { SubscriptionPriceNotFoundException } from '../exceptions/SubscriptionPriceNotFoundException.js';
import type { IdGenerator } from '../ports/IdGenerator.js';
import type { InvoiceLineRepository } from '../ports/InvoiceLineRepository.js';
import type { InvoiceRepository } from '../ports/InvoiceRepository.js';
import type { InvoiceProviderResolver } from '../ports/InvoiceProviderResolver.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import {
  TranslationKey,
  type TranslatorFactory,
} from '../ports/Translator.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { UserRepository } from '../ports/UserRepository.js';
import { Money } from '../../domain/money/Money.js';
import { FilterOperator } from '../models/Filter.js';
import { SupportedCurrency } from '../../domain/money/SupportedCurrency.js';

export interface CreateInvoiceCommand {
  initiatorUserId: string;
  type: InvoiceLineType;
  referenceId: string;
  provider: BillingProvider;
  locale: string;
}

export interface CreateInvoiceResult {
  data: {
    invoice: Invoice;
    locale: string;
  };
}

export class CreateInvoiceUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceLineRepository: InvoiceLineRepository,
    private readonly invoiceProviderResolver: InvoiceProviderResolver,
    private readonly idGenerator: IdGenerator,
    private readonly transactionRunner: TransactionRunner,
    private readonly translatorFactory: TranslatorFactory,
  ) {}

  async execute(
    command: CreateInvoiceCommand,
  ): Promise<CreateInvoiceResult> {
    const customer = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
    });

    const locale = customer.locale ?? command.locale;

    const currencyCode =
      customer.preferredCurrencyCode ?? SupportedCurrency.USD;

    const subscriptionPlan =
      await this.subscriptionPlanRepository.loadOrThrow({
        filter: {
          field: 'id',
          operator: FilterOperator.Equals,
          value: command.referenceId,
        },
        with: {
          subscriptionPlanTranslations: {
            filter: {
              field: 'locale',
              operator: FilterOperator.Equals,
              value: locale,
            },
          },
          subscriptionPrices: {
            filter: {
              and: [
                {
                  field: 'active',
                  operator: FilterOperator.Equals,
                  value: true,
                },
                {
                  field: 'currencyCode',
                  operator: FilterOperator.Equals,
                  value: currencyCode,
                },
              ],
            },
          },
        },
      });

    const invoiceProvider = this.invoiceProviderResolver.resolve(
      command.provider,
    );

    const invoiceId = this.idGenerator.generate();

    const planTranslation =
      subscriptionPlan.getTranslation(locale);

    const planName =
      planTranslation?.name ?? subscriptionPlan.code;

    const translator = this.translatorFactory.forLocale(locale);

    const invoiceLineTitle = translator.translate(
      TranslationKey.SubscriptionPlanInvoiceLineTitle,
      {
        planTitle: planName,
        interval: subscriptionPlan.billingInterval.toLowerCase(),
        count: subscriptionPlan.billingIntervalCount,
      },
    );

    const subscriptionPrice =
      subscriptionPlan.getActivePrice(currencyCode);

    if (!subscriptionPrice) {
      throw new SubscriptionPriceNotFoundException();
    }

    const externalInvoice = await invoiceProvider.create({
      invoiceId,
      description: planName,
      amount: Money.fromMinor(
        subscriptionPrice.amountMinor,
        subscriptionPrice.currencyCode,
      ),
      currencyCode: subscriptionPrice.currencyCode,
    });

    const preparedInvoice = Invoice.create({
      id: invoiceId,
      externalId: externalInvoice.externalId,
      provider: command.provider,
      billingEmail: customer.email,
      userId: customer.id,
      status: externalInvoice.status ?? InvoiceStatus.Pending,
      totalAmountMinor: Money.toMinor(
        externalInvoice.amount,
        externalInvoice.currencyCode,
      ),
      amountPaidMinor: 0,
      currencyCode: externalInvoice.currencyCode,
      externalCheckoutUrl: externalInvoice.externalCheckoutUrl,
      expiresAt: externalInvoice.expiresAt,
    });

    const preparedInvoiceLines = [
      InvoiceLine.create({
        id: this.idGenerator.generate(),
        invoiceId,
        referenceId: command.referenceId,
        type: command.type,
        title: invoiceLineTitle,
        amount: subscriptionPrice.amountMinor,
      }),
    ];

    const savedInvoice = await this.transactionRunner.run(
      async (transactionContext) => {
        const invoice = await this.invoiceRepository.save(
          preparedInvoice,
          transactionContext,
        );

        const invoiceLines: InvoiceLine[] = [];

        for (const preparedInvoiceLine of preparedInvoiceLines) {
          invoiceLines.push(
            await this.invoiceLineRepository.save(
              preparedInvoiceLine,
              transactionContext,
            ),
          );
        }

        return invoice.withLines(invoiceLines);
      },
    );

    return {
      data: {
        invoice: savedInvoice,
        locale,
      },
    };
  }
}
