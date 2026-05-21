import { Invoice } from '../../domain/subscription/Invoice.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface InvoiceRepository {
  save(
    invoice: Invoice,
    transactionContext?: TransactionContext,
  ): Promise<Invoice>;
}
