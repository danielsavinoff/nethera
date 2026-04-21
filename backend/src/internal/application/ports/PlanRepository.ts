import { Plan } from '../../domain/subscription/Plan.js';
import { PlanRecord } from '../../domain/subscription/PlanRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadPlanQuery {
  filters:
    | { id: PlanRecord['id'] }
    | { code: PlanRecord['code'] };
}

export interface LoadPlansQuery {
  filters?: {
    active?: PlanRecord['active'];
  };
}

export interface PlanRepository {
  load(
    query: LoadPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<Plan | null>;
  loadMany(
    query: LoadPlansQuery,
    transactionContext?: TransactionContext,
  ): Promise<Plan[]>;
  loadOrThrow(
    query: LoadPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<Plan>;
  save(
    plan: Plan,
    transactionContext?: TransactionContext,
  ): Promise<Plan>;
}
