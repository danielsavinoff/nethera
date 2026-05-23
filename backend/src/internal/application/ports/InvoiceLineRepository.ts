import { InvoiceLine } from '../../domain/subscription/InvoiceLine.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface InvoiceLineRepository {
  save(
    invoiceLine: InvoiceLine,
    transactionContext?: TransactionContext,
  ): Promise<InvoiceLine>;
}
