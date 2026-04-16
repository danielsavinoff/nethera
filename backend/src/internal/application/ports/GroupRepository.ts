import type { TransactionContext } from '../models/TransactionContext.js';
import type { Group } from '../../domain/group/Group.js';
import type { GroupRecord } from '../../domain/group/GroupRecord.js';
import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';

export interface LoadGroupQuery {
  filters: {
    tenantId: TenantRecord['id'];
    externalId: GroupRecord['externalId'];
  };
}

export interface GroupRepository {
  load(
    query: LoadGroupQuery,
    transactionContext?: TransactionContext,
  ): Promise<Group | null>;
  save(
    group: Group,
    transactionContext?: TransactionContext,
  ): Promise<Group>;
}
