import type { TransactionContext } from '../models/TransactionContext.js';
import type { TimeAllocation } from '../../domain/time-allocation/TimeAllocation.js';
import type { TimeAllocationRecord } from '../../domain/time-allocation/TimeAllocationRecord.js';
import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';

export interface LoadTimeAllocationQuery {
  filters: {
    tenantId: TenantRecord['id'];
    externalId: TimeAllocationRecord['externalId'];
  };
}

export interface TimeAllocationRepository {
  load(
    query: LoadTimeAllocationQuery,
    transactionContext?: TransactionContext,
  ): Promise<TimeAllocation | null>;
  save(
    timeAllocation: TimeAllocation,
    transactionContext?: TransactionContext,
  ): Promise<TimeAllocation>;
}
