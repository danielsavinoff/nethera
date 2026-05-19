import { SubscriptionInvoice } from '../../domain/subscription/SubscriptionInvoice.js';
import { SubscriptionInvoiceRecord } from '../../domain/subscription/SubscriptionInvoiceRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadSubscriptionInvoicesQuery {
  filters?: {
    subscriptionId?: SubscriptionInvoiceRecord['subscriptionId'];
    userId?: SubscriptionInvoiceRecord['userId'];
    status?: SubscriptionInvoiceRecord['status'];
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface SubscriptionInvoiceRepository {
  loadMany(
    query: LoadSubscriptionInvoicesQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionInvoice[]>;
  save(
    subscriptionInvoice: SubscriptionInvoice,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionInvoice>;
}
