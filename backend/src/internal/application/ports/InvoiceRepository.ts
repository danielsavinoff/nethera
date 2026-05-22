import { InvoiceRecord } from '../../domain/subscription/InvoiceRecord.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import { TransactionContext } from '../models/TransactionContext.js';
import { Query } from '../models/Query.js';

export interface InvoiceRepository {
  load(query: Query<InvoiceRecord>): Promise<Invoice | null>;
  loadOrThrow(query: Query<InvoiceRecord>): Promise<Invoice>;
  save(
    invoice: Invoice,
    transactionContext?: TransactionContext,
  ): Promise<Invoice>;
}
