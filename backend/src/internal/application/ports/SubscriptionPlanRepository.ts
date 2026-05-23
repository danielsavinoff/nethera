import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanFeatureRecord } from '../../domain/subscription/SubscriptionPlanFeatureRecord.js';
import { SubscriptionPlanFeatureTranslationRecord } from '../../domain/subscription/SubscriptionPlanFeatureTranslationRecord.js';
import { SubscriptionPlanRecord } from '../../domain/subscription/SubscriptionPlanRecord.js';
import { SubscriptionPlanTranslationRecord } from '../../domain/subscription/SubscriptionPlanTranslationRecord.js';
import { SubscriptionPriceRecord } from '../../domain/subscription/SubscriptionPriceRecord.js';
import {
  PaginatedRepositoryQuery,
  RepositoryQuery,
} from '../models/RepositoryQuery.js';
import { TransactionContext } from '../models/TransactionContext.js';

export type SubscriptionPlanWith = {
  subscriptionPlanTranslations: {
    entity: SubscriptionPlanTranslationRecord;
  };
  subscriptionPlanFeatures: {
    entity: SubscriptionPlanFeatureRecord;
    with: {
      subscriptionPlanFeatureTranslations: {
        entity: SubscriptionPlanFeatureTranslationRecord;
      };
    };
  };
  subscriptionPrices: {
    entity: SubscriptionPriceRecord;
  };
};

export interface SubscriptionPlanRepository {
  load(
    query: RepositoryQuery<
      SubscriptionPlanRecord,
      SubscriptionPlanWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan | null>;
  loadMany(
    query: PaginatedRepositoryQuery<
      SubscriptionPlanRecord,
      SubscriptionPlanWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan[]>;
  loadOrThrow(
    query: RepositoryQuery<
      SubscriptionPlanRecord,
      SubscriptionPlanWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan>;
  save(
    subscriptionPlan: SubscriptionPlan,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan>;
}
