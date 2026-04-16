import type { TransactionContext } from '../models/TransactionContext.js';
import type { Task } from '../../domain/task/Task.js';
import type { TaskRecord } from '../../domain/task/TaskRecord.js';
import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';

export interface LoadTaskQuery {
  filters: {
    tenantId: TenantRecord['id'];
    externalId: TaskRecord['externalId'];
  };
}

export interface TaskRepository {
  load(
    query: LoadTaskQuery,
    transactionContext?: TransactionContext,
  ): Promise<Task | null>;
  save(
    task: Task,
    transactionContext?: TransactionContext,
  ): Promise<Task>;
}
