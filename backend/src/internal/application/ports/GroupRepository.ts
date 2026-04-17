import type { TransactionContext } from '../models/TransactionContext.js';
import type { Page } from '../models/Page.js';
import type { Group } from '../../domain/group/Group.js';
import type { GroupRecord } from '../../domain/group/GroupRecord.js';
import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';

export interface LoadGroupQuery {
  filters:
    | {
        tenantId: TenantRecord['id'];
        externalId: GroupRecord['externalId'];
      }
    | {
        id: GroupRecord['id'];
      };
}

export interface LoadGroupsQuery {
  filters: {
    tenantId: TenantRecord['id'];
    isDeleted?: GroupRecord['isDeleted'];
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface GroupRepository {
  loadMany(query: LoadGroupsQuery): Promise<Page<Group>>;
  load(
    query: LoadGroupQuery,
    transactionContext?: TransactionContext,
  ): Promise<Group | null>;
  loadOrThrow(
    query: LoadGroupQuery,
    transactionContext?: TransactionContext,
  ): Promise<Group>;
  save(
    group: Group,
    transactionContext?: TransactionContext,
  ): Promise<Group>;
}
