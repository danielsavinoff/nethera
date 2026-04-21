import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionRecord } from '../../domain/subscription/SubscriptionRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadSubscriptionQuery {
  filters: { id: SubscriptionRecord['id'] };
}

export interface SubscriptionRepository {
  load(
    query: LoadSubscriptionQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription | null>;
  loadOrThrow(
    query: LoadSubscriptionQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription>;
  save(
    subscription: Subscription,
    transactionContext?: TransactionContext,
  ): Promise<Subscription>;
}
