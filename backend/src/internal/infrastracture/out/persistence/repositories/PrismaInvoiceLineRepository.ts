import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type { InvoiceLineRepository } from '../../../../application/ports/InvoiceLineRepository.js';
import { InvoiceLine } from '../../../../domain/subscription/InvoiceLine.js';
import { PrismaBaseRepository } from '../base/PrismaBaseRepository.js';

@Injectable()
export class PrismaInvoiceLineRepository
  extends PrismaBaseRepository
  implements InvoiceLineRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async save(
    invoiceLine: InvoiceLine,
    transactionContext?: TransactionContext,
  ): Promise<InvoiceLine> {
    const client = this.getClient(transactionContext);

    const record = invoiceLine.toRecord();

    const row = await client.invoiceLine.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        reference_id: record.referenceId,
        type: record.type,
        title: record.title,
        amount: record.amount,
        invoice_id: record.invoiceId,
      },
      update: {
        reference_id: record.referenceId,
        type: record.type,
        title: record.title,
        amount: record.amount,
        invoice_id: record.invoiceId,
      },
    });

    return InvoiceLine.hydrate({
      id: row.id,
      referenceId: row.reference_id,
      type: row.type,
      title: row.title ?? undefined,
      amount: row.amount,
      invoiceId: row.invoice_id,
    });
  }
}
