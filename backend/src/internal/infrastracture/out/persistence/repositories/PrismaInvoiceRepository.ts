import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type { InvoiceRepository } from '../../../../application/ports/InvoiceRepository.js';
import { Invoice } from '../../../../domain/subscription/Invoice.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
        amount_due_minor: record.amountDueMinor,
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
        amount_due_minor: record.amountDueMinor,
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
      amountDueMinor: row.amount_due_minor,
      currency: row.currency,
      externalCheckoutUrl: row.external_checkout_url,
      expiresAt: row.expires_at ?? undefined,
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
