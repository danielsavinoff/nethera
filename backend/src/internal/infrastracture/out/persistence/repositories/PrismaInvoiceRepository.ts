import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { InvoiceNotFoundException } from '../../../../application/exceptions/InvoiceNotFoundException.js';
import {
  Filter,
  FilterOperator,
  Query,
} from '../../../../application/models/Query.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type { InvoiceRepository } from '../../../../application/ports/InvoiceRepository.js';
import { Invoice } from '../../../../domain/subscription/Invoice.js';
import { InvoiceRecord } from '../../../../domain/subscription/InvoiceRecord.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: Query<InvoiceRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Invoice | null> {
    const client = this.getClient(transactionContext);

    const row = await client.invoice.findFirst({
      where: this.buildWhere(query.filter),
    });

    return row
      ? Invoice.hydrate({
          id: row.id,
          externalId: row.external_id,
          provider: row.provider,
          userId: row.user_id,
          status: row.status,
          totalAmountMinor: row.total_amount_minor,
          amountPaidMinor: row.amount_paid_minor,
          currency: row.currency,
          externalCheckoutUrl: row.external_checkout_url,
          expiresAt: row.expires_at ?? undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
      : null;
  }

  async loadOrThrow(
    query: Query<InvoiceRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Invoice> {
    const invoice = await this.load(query, transactionContext);

    if (!invoice) {
      throw new InvoiceNotFoundException();
    }

    return invoice;
  }

  async save(
    invoice: Invoice,
    transactionContext?: TransactionContext,
  ): Promise<Invoice> {
    const client = this.getClient(transactionContext);

    const record = invoice.toRecord();

    const row = await client.invoice.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        external_id: record.externalId,
        provider: record.provider,
        user_id: record.userId,
        status: record.status,
        total_amount_minor: record.totalAmountMinor,
        amount_paid_minor: record.amountPaidMinor,
        currency: record.currency,
        external_checkout_url: record.externalCheckoutUrl,
        expires_at: record.expiresAt,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        external_id: record.externalId,
        provider: record.provider,
        user_id: record.userId,
        status: record.status,
        total_amount_minor: record.totalAmountMinor,
        amount_paid_minor: record.amountPaidMinor,
        currency: record.currency,
        external_checkout_url: record.externalCheckoutUrl,
        expires_at: record.expiresAt,
        updated_at: record.updatedAt,
      },
    });

    return Invoice.hydrate({
      id: row.id,
      externalId: row.external_id,
      provider: row.provider,
      userId: row.user_id,
      status: row.status,
      totalAmountMinor: row.total_amount_minor,
      amountPaidMinor: row.amount_paid_minor,
      currency: row.currency,
      externalCheckoutUrl: row.external_checkout_url,
      expiresAt: row.expires_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private buildWhere(
    filter: Filter<InvoiceRecord>,
  ): Prisma.InvoiceWhereInput {
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

  private mapField(field: keyof InvoiceRecord): string {
    const fieldMap: Record<keyof InvoiceRecord, string> = {
      id: 'id',
      externalId: 'external_id',
      provider: 'provider',
      userId: 'user_id',
      status: 'status',
      totalAmountMinor: 'total_amount_minor',
      amountPaidMinor: 'amount_paid_minor',
      currency: 'currency',
      externalCheckoutUrl: 'external_checkout_url',
      expiresAt: 'expires_at',
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
