import { Tenant } from '../../domain/tenant/Tenant.js';
import { TenantId } from '../../domain/tenant/TenantRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface TenantRepository {
  loadByMemberId(
    memberId: string,
    transactionContext?: TransactionContext,
  ): Promise<Tenant | null>;
  save(
    tenant: Tenant,
    transactionContext?: TransactionContext,
  ): Promise<Tenant>;
  loadByIdOrThrow(id: TenantId): Promise<Tenant>;
  findInstalledTenantIds(): Promise<TenantId[]>;
}
