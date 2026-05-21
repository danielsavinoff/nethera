import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaymentNotFoundException } from '../../../../application/exceptions/PaymentNotFoundException.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadPaymentQuery,
  LoadPaymentsQuery,
  PaymentRepository,
} from '../../../../application/ports/PaymentRepository.js';
import { Payment } from '../../../../domain/subscription/Payment.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadPaymentQuery,
    transactionContext?: TransactionContext,
  ): Promise<Payment | null> {
    const client = this.getClient(transactionContext);

    const row = await client.payment.findFirst({
      where:
        'id' in query.filters
          ? {
              id: query.filters.id,
            }
          : {
              provider: query.filters.provider,
              external_id: query.filters.externalId,
            },
    });

    return row ? this.hydrate(row) : null;
  }

  async loadOrThrow(
    query: LoadPaymentQuery,
    transactionContext?: TransactionContext,
  ): Promise<Payment> {
    const payment = await this.load(query, transactionContext);

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    return payment;
  }

  async loadMany(
    query: LoadPaymentsQuery,
    transactionContext?: TransactionContext,
  ): Promise<Payment[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.payment.findMany({
      where: {
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
        ...(query.filters?.provider
          ? {
              provider: query.filters.provider,
            }
          : {}),
        ...(query.filters?.externalId
          ? {
              external_id: query.filters.externalId,
            }
          : {}),
      },
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      take: query.page?.limit,
      skip: query.page?.skip,
    });

    return rows.map((row) => this.hydrate(row));
  }

  async save(
    payment: Payment,
    transactionContext?: TransactionContext,
  ): Promise<Payment> {
    const client = this.getClient(transactionContext);

    const record = payment.toRecord();

    const row = await client.payment.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        user_id: record.userId,
        status: record.status,
        amount_minor: record.amountMinor,
        currency: record.currency,
        due_at: record.dueAt,
        paid_at: record.paidAt,
        failed_at: record.failedAt,
        voided_at: record.voidedAt,
        provider: record.provider,
        external_id: record.externalId,
        failure_code: record.failureCode,
        failure_message: record.failureMessage,
        metadata: record.metadata,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        user_id: record.userId,
        status: record.status,
        amount_minor: record.amountMinor,
        currency: record.currency,
        due_at: record.dueAt,
        paid_at: record.paidAt,
        failed_at: record.failedAt,
        voided_at: record.voidedAt,
        provider: record.provider,
        external_id: record.externalId,
        failure_code: record.failureCode,
        failure_message: record.failureMessage,
        metadata: record.metadata,
        updated_at: record.updatedAt,
      },
    });

    return this.hydrate(row);
  }

  private hydrate(row: {
    id: string;
    user_id: string;
    status: string;
    amount_minor: number;
    currency: string;
    due_at: Date | null;
    paid_at: Date | null;
    failed_at: Date | null;
    voided_at: Date | null;
    provider: string;
    external_id: string;
    failure_code: string | null;
    failure_message: string | null;
    metadata: unknown;
    created_at: Date;
    updated_at: Date;
  }): Payment {
    return Payment.hydrate({
      id: row.id,
      userId: row.user_id,
      status: row.status,
      amountMinor: row.amount_minor,
      currency: row.currency,
      dueAt: row.due_at ?? undefined,
      paidAt: row.paid_at ?? undefined,
      failedAt: row.failed_at ?? undefined,
      voidedAt: row.voided_at ?? undefined,
      provider: row.provider,
      externalId: row.external_id,
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
