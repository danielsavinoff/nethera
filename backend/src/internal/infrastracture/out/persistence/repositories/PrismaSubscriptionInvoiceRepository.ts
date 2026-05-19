import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadSubscriptionInvoicesQuery,
  SubscriptionInvoiceRepository,
} from '../../../../application/ports/SubscriptionInvoiceRepository.js';
import { SubscriptionInvoice } from '../../../../domain/subscription/SubscriptionInvoice.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaSubscriptionInvoiceRepository implements SubscriptionInvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadMany(
    query: LoadSubscriptionInvoicesQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionInvoice[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.subscriptionInvoice.findMany({
      where: {
        ...(query.filters?.subscriptionId
          ? {
              subscription_id: query.filters.subscriptionId,
            }
          : {}),
        ...(query.filters?.userId
          ? {
              user_id: query.filters.userId,
            }
          : {}),
        ...(query.filters?.status
          ? {
              status: query.filters.status,
            }
          : {}),
      },
      orderBy: [{ issued_at: 'desc' }, { id: 'asc' }],
      take: query.page?.limit,
      skip: query.page?.skip,
    });

    return rows.map((row) =>
      SubscriptionInvoice.hydrate({
        id: row.id,
        subscriptionId: row.subscription_id,
        userId: row.user_id,
        status: row.status,
        amountDue: row.amount_due.toString(),
        amountPaid: row.amount_paid.toString(),
        currency: row.currency,
        periodStartAt: row.period_start_at ?? undefined,
        periodEndAt: row.period_end_at ?? undefined,
        issuedAt: row.issued_at,
        dueAt: row.due_at ?? undefined,
        paidAt: row.paid_at ?? undefined,
        failedAt: row.failed_at ?? undefined,
        voidedAt: row.voided_at ?? undefined,
        provider: row.provider ?? undefined,
        providerInvoiceId: row.provider_invoice_id ?? undefined,
        providerPaymentIntentId:
          row.provider_payment_intent_id ?? undefined,
        checkoutUrl: row.checkout_url ?? undefined,
        failureCode: row.failure_code ?? undefined,
        failureMessage: row.failure_message ?? undefined,
        metadata:
          row.metadata === null
            ? undefined
            : JSON.stringify(row.metadata),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }),
    );
  }

  async save(
    subscriptionInvoice: SubscriptionInvoice,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionInvoice> {
    const client = this.getClient(transactionContext);

    const record = subscriptionInvoice.toRecord();

    const row = await client.subscriptionInvoice.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        subscription_id: record.subscriptionId,
        user_id: record.userId,
        status: record.status,
        amount_due: record.amountDue,
        amount_paid: record.amountPaid,
        currency: record.currency,
        period_start_at: record.periodStartAt,
        period_end_at: record.periodEndAt,
        issued_at: record.issuedAt,
        due_at: record.dueAt,
        paid_at: record.paidAt,
        failed_at: record.failedAt,
        voided_at: record.voidedAt,
        provider: record.provider,
        provider_invoice_id: record.providerInvoiceId,
        provider_payment_intent_id:
          record.providerPaymentIntentId,
        checkout_url: record.checkoutUrl,
        failure_code: record.failureCode,
        failure_message: record.failureMessage,
        metadata: record.metadata,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        subscription_id: record.subscriptionId,
        user_id: record.userId,
        status: record.status,
        amount_due: record.amountDue,
        amount_paid: record.amountPaid,
        currency: record.currency,
        period_start_at: record.periodStartAt,
        period_end_at: record.periodEndAt,
        issued_at: record.issuedAt,
        due_at: record.dueAt,
        paid_at: record.paidAt,
        failed_at: record.failedAt,
        voided_at: record.voidedAt,
        provider: record.provider,
        provider_invoice_id: record.providerInvoiceId,
        provider_payment_intent_id:
          record.providerPaymentIntentId,
        checkout_url: record.checkoutUrl,
        failure_code: record.failureCode,
        failure_message: record.failureMessage,
        metadata: record.metadata,
        updated_at: record.updatedAt,
      },
    });

    return SubscriptionInvoice.hydrate({
      id: row.id,
      subscriptionId: row.subscription_id,
      userId: row.user_id,
      status: row.status,
      amountDue: row.amount_due.toString(),
      amountPaid: row.amount_paid.toString(),
      currency: row.currency,
      periodStartAt: row.period_start_at ?? undefined,
      periodEndAt: row.period_end_at ?? undefined,
      issuedAt: row.issued_at,
      dueAt: row.due_at ?? undefined,
      paidAt: row.paid_at ?? undefined,
      failedAt: row.failed_at ?? undefined,
      voidedAt: row.voided_at ?? undefined,
      provider: row.provider ?? undefined,
      providerInvoiceId: row.provider_invoice_id ?? undefined,
      providerPaymentIntentId:
        row.provider_payment_intent_id ?? undefined,
      checkoutUrl: row.checkout_url ?? undefined,
      failureCode: row.failure_code ?? undefined,
      failureMessage: row.failure_message ?? undefined,
      metadata:
        row.metadata === null
          ? undefined
          : JSON.stringify(row.metadata),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
