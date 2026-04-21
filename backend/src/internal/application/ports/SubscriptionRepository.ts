import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionRecord } from '../../domain/subscription/SubscriptionRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadSubscriptionQuery {
  filters: { id: SubscriptionRecord['id'] };
}

export interface LoadSubscriptionsQuery {
  filters?: {
    userId?: SubscriptionRecord['userId'];
  };
}

export interface SubscriptionRepository {
  load(
    query: LoadSubscriptionQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription | null>;
  loadMany(
    query: LoadSubscriptionsQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription[]>;
  loadOrThrow(
    query: LoadSubscriptionQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription>;
  save(
    subscription: Subscription,
    transactionContext?: TransactionContext,
  ): Promise<Subscription>;
}
