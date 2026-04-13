import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ExternalSmartProcess } from '../models/ExternalSmartProcess.js';

export interface FetchExternalSmartProcessQuery {
  filters: {
    externalId: string;
  };
}

export interface SmartProcessProvider {
  create(
    credentials: TenantCredentials,
  ): Promise<ExternalSmartProcess>;
  fetchOneOrThrow(
    credentials: TenantCredentials,
    query: FetchExternalSmartProcessQuery,
  ): Promise<ExternalSmartProcess>;
}
