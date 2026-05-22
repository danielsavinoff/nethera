import { Subscription } from '../../domain/subscription/Subscription.js';
import {
  PaginatedRepositoryQuery,
  RepositoryQuery,
} from '../models/RepositoryQuery.js';
import { TransactionContext } from '../models/TransactionContext.js';
import { SubscriptionRecord } from '../../domain/subscription/SubscriptionRecord.js';
import { SubscriptionPlanRecord } from '../../domain/subscription/SubscriptionPlanRecord.js';
import { SubscriptionPlanTranslationRecord } from '../../domain/subscription/SubscriptionPlanTranslationRecord.js';

export type SubscriptionWith = {
  subscriptionPlans: {
    entity: SubscriptionPlanRecord;
    with: {
      subscriptionPlanTranslations: {
        entity: SubscriptionPlanTranslationRecord;
      };
    };
  };
};

export interface SubscriptionRepository {
  load(
    query: RepositoryQuery<SubscriptionRecord, SubscriptionWith>,
    transactionContext?: TransactionContext,
  ): Promise<Subscription | null>;
  loadMany(
    query: PaginatedRepositoryQuery<
      SubscriptionRecord,
      SubscriptionWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<Subscription[]>;
  loadOrThrow(
    query: RepositoryQuery<SubscriptionRecord, SubscriptionWith>,
    transactionContext?: TransactionContext,
  ): Promise<Subscription>;
  save(
    subscription: Subscription,
    transactionContext?: TransactionContext,
  ): Promise<Subscription>;
}
