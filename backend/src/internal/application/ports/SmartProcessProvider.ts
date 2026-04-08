import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ExternalSmartProcess } from '../models/ExternalSmartProcess.js';

export interface SmartProcessProvider {
  create(
    credentials: TenantCredentials,
  ): Promise<ExternalSmartProcess>;
  findByExternalId(
    externalId: string,
    credentials: TenantCredentials,
  ): Promise<ExternalSmartProcess>;
}
