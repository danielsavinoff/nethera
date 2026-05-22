import { InvoiceRecord } from '../../domain/subscription/InvoiceRecord.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import { TransactionContext } from '../models/TransactionContext.js';
import { RepositoryQuery } from '../models/RepositoryQuery.js';
import { InvoiceLineRecord } from '../../domain/subscription/InvoiceLineRecord.js';

export type InvoiceWith = {
  lines: {
    entity: InvoiceLineRecord;
  };
};

export interface InvoiceRepository {
  load(
    query: RepositoryQuery<InvoiceRecord, InvoiceWith>,
  ): Promise<Invoice | null>;
  loadOrThrow(
    query: RepositoryQuery<InvoiceRecord, InvoiceWith>,
  ): Promise<Invoice>;
  save(
    invoice: Invoice,
    transactionContext?: TransactionContext,
  ): Promise<Invoice>;
}
