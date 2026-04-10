import { User } from '../../domain/user/User.js';
import type {
  TenantId,
  TenantRecord,
} from '../../domain/tenant/TenantRecord.js';
import { UserRecord } from '../../domain/user/UserRecord.js';
import type { Page } from '../models/Page.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface UserRepository {
  findById(id: UserRecord['id']): Promise<User | null>;
  findByIdOrThrow(id: UserRecord['id']): Promise<User>;
  findByIdWithRoles(id: UserRecord['id']): Promise<User | null>;
  loadAllByTenantId(
    tenantId: TenantRecord['id'],
  ): Promise<User[]>;
  loadAllActiveByTenantId(
    tenantId: TenantRecord['id'],
  ): Promise<User[]>;
  loadAllInactiveByTenantId(
    tenantId: TenantRecord['id'],
  ): Promise<User[]>;
  loadPageByTenantId(
    tenantId: TenantRecord['id'],
    options: {
      active?: boolean;
      q?: string;
      page: number;
      limit: number;
    },
  ): Promise<Page<User>>;
  findByTenantAndExternalIdWithRoles(
    tenantId: TenantId,
    externalId: number,
    transactionContext?: TransactionContext,
  ): Promise<User | null>;
  findAllByTenantAndExternalIds(
    tenantId: string,
    externalIds: number[],
  ): Promise<User[]>;
  save(
    user: User,
    transactionContext?: TransactionContext,
  ): Promise<User>;
}
