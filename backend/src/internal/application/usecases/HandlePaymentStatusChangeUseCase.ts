import type { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import { PaymentStatus } from '../../domain/subscription/PaymentStatus.js';
import { FilterOperator } from '../models/Query.js';
import { InvoiceRepository } from '../ports/InvoiceRepository.js';
import { PaymentRepository } from '../ports/PaymentRepository.js';
import { TransactionRunner } from '../ports/TransactionRunner.js';
import { Payment } from 'src/internal/domain/subscription/Payment.js';
import { Money } from 'src/internal/domain/money/Money.js';
import { Invoice } from 'src/internal/domain/subscription/Invoice.js';

export interface HandlePaymentStatusChangeCommand {
  externalId: string;
  invoiceId?: string;
  externalInvoiceId?: string;
  provider: BillingProvider;
  status: PaymentStatus;
  currency: string;
  amount: number;
}

export type HandlePaymentStatusChangeResult = void;

export class HandlePaymentStatusChangeUseCase {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly transactionRunner: TransactionRunner,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(
    command: HandlePaymentStatusChangeCommand,
  ): Promise<HandlePaymentStatusChangeResult> {
    const invoice = await this.invoiceRepository.loadOrThrow({
      filter: {
        and: [
          {
            field: 'provider',
            operator: FilterOperator.Equals,
            value: command.provider,
          },
          {
            or: [
              {
                field: 'id',
                operator: FilterOperator.Equals,
                value: command.invoiceId,
              },
              {
                field: 'externalId',
                operator: FilterOperator.Equals,
                value: command.externalInvoiceId,
              },
            ],
          },
        ],
      },
    });

    const recalculatedInvoice =
      await this.transactionRunner.run<Invoice>(
        async (transactionContext) => {
          let payment = await this.paymentRepository.load(
            {
              filter: {
                and: [
                  {
                    field: 'provider',
                    operator: FilterOperator.Equals,
                    value: command.provider,
                  },
                  {
                    field: 'externalId',
                    operator: FilterOperator.Equals,
                    value: command.externalId,
                  },
                ],
              },
            },
            transactionContext,
          );

          if (payment?.isTerminal()) {
            return invoice;
          }

          if (!payment) {
            payment = await this.paymentRepository.save(
              Payment.create({
                provider: command.provider,
                externalId: command.externalId,
                currency: command.currency,
                status: command.status,
                userId: invoice.userId,
                amountMinor: Money.toMinor(
                  command.amount,
                  command.currency,
                ),
              }),
              transactionContext,
            );
          }

          if (!payment.hasStatus(command.status)) {
            payment = await this.paymentRepository.save(
              payment.transitionTo(command.status),
              transactionContext,
            );
          }

          if (payment.hasStatus(PaymentStatus.Paid)) {
            return this.invoiceRepository.save(
              invoice.applyPayment(payment),
            );
          }

          return invoice;
        },
      );

    if (!recalculatedInvoice.isPaid()) {
      return;
    }

    // TODO: Emit an event invoice.paid.
  }
}
