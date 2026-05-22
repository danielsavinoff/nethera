import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PaymentNotFoundException } from '../../../../application/exceptions/PaymentNotFoundException.js';
import {
  Filter,
  FilterOperator,
  PaginatedQuery,
  Query,
} from '../../../../application/models/Query.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type { PaymentRepository } from '../../../../application/ports/PaymentRepository.js';
import { Payment } from '../../../../domain/subscription/Payment.js';
import { PaymentRecord } from '../../../../domain/subscription/PaymentRecord.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: Query<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment | null> {
    const client = this.getClient(transactionContext);

    const row = await client.payment.findFirst({
      where: this.buildWhere(query.filter),
    });

    return row
      ? Payment.hydrate({
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
        })
      : null;
  }

  async loadOrThrow(
    query: Query<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment> {
    const payment = await this.load(query, transactionContext);

    if (!payment) {
      throw new PaymentNotFoundException();
    }

    return payment;
  }

  async loadMany(
    query: PaginatedQuery<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.payment.findMany({
      where: query.filter
        ? this.buildWhere(query.filter)
        : undefined,
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      take: query.page?.limit,
      skip: query.page?.offset,
    });

    return rows.map((row) =>
      Payment.hydrate({
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
      }),
    );
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

  private buildWhere(
    filter: Filter<PaymentRecord>,
  ): Prisma.PaymentWhereInput {
    if ('and' in filter) {
      return {
        AND: filter.and.map((nestedFilter) =>
          this.buildWhere(nestedFilter),
        ),
      };
    }

    if ('or' in filter) {
      return {
        OR: filter.or.map((nestedFilter) =>
          this.buildWhere(nestedFilter),
        ),
      };
    }

    const field = this.mapField(filter.field);

    if (filter.operator === FilterOperator.In) {
      return {
        [field]: {
          in: filter.value,
        },
      };
    }

    return {
      [field]: filter.value,
    };
  }

  private mapField(field: keyof PaymentRecord): string {
    const fieldMap: Record<keyof PaymentRecord, string> = {
      id: 'id',
      userId: 'user_id',
      status: 'status',
      amountMinor: 'amount_minor',
      currency: 'currency',
      dueAt: 'due_at',
      paidAt: 'paid_at',
      failedAt: 'failed_at',
      voidedAt: 'voided_at',
      provider: 'provider',
      externalId: 'external_id',
      failureCode: 'failure_code',
      failureMessage: 'failure_message',
      metadata: 'metadata',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    return fieldMap[field];
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
