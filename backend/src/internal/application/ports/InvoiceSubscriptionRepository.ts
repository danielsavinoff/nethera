import { InvoiceSubscription } from '../../domain/subscription/InvoiceSubscription.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface InvoiceSubscriptionRepository {
  save(
    invoiceSubscription: InvoiceSubscription,
    transactionContext?: TransactionContext,
  ): Promise<InvoiceSubscription>;
}
