import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalTask } from '../models/ExternalTask.js';

export interface FetchExternalTaskQuery {
  filters: {
    externalId: string;
  };
}

export interface FetchExternalTasksQuery {
  filters: {
    externalIds?: string[];
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface TaskProvider {
  fetch(
    credentials: TenantCredentials,
    query: FetchExternalTaskQuery,
  ): Promise<ExternalTask | null>;
  fetchMany(
    credentials: TenantCredentials,
    query: FetchExternalTasksQuery,
  ): Promise<ExternalTask[]>;
}
