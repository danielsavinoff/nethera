import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanRecord } from '../../domain/subscription/SubscriptionPlanRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadSubscriptionPlanQuery {
  filters:
    | { id: SubscriptionPlanRecord['id'] }
    | { code: SubscriptionPlanRecord['code'] };
}

export interface LoadSubscriptionPlansQuery {
  filters?: {
    active?: SubscriptionPlanRecord['active'];
  };
}

export interface SubscriptionPlanRepository {
  load(
    query: LoadSubscriptionPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan | null>;
  loadMany(
    query: LoadSubscriptionPlansQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan[]>;
  loadOrThrow(
    query: LoadSubscriptionPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan>;
  save(
    subscriptionPlan: SubscriptionPlan,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan>;
}
