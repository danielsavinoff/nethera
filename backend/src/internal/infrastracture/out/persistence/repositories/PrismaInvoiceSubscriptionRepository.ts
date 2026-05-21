import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type { InvoiceSubscriptionRepository } from '../../../../application/ports/InvoiceSubscriptionRepository.js';
import { InvoiceSubscription } from '../../../../domain/subscription/InvoiceSubscription.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaInvoiceSubscriptionRepository implements InvoiceSubscriptionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(
    invoiceSubscription: InvoiceSubscription,
    transactionContext?: TransactionContext,
  ): Promise<InvoiceSubscription> {
    const client = this.getClient(transactionContext);

    const record = invoiceSubscription.toRecord();

    const row = await client.invoiceSubscription.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        invoice_id: record.invoiceId,
        subscription_id: record.subscriptionId,
      },
      update: {
        invoice_id: record.invoiceId,
        subscription_id: record.subscriptionId,
      },
    });

    return InvoiceSubscription.hydrate({
      id: row.id,
      invoiceId: row.invoice_id,
      subscriptionId: row.subscription_id,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
