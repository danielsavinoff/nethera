import { SmartProcess } from '../../domain/smart-process/SmartProcess.js';
import { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface SmartProcessRepository {
  save(
    smartProcess: SmartProcess,
    transactionContext?: TransactionContext,
  ): Promise<SmartProcess>;
  loadByTenantId(
    tenantId: TenantRecord['id'],
    transactionContext?: TransactionContext,
  ): Promise<SmartProcess | null>;
}
