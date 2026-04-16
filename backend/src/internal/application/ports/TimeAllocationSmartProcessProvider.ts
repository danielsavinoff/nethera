import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { SmartProcess } from '../../domain/smart-process/SmartProcess.js';
import type { ExternalTimeAllocation } from '../models/ExternalTimeAllocation.js';
import type { Page } from '../models/Page.js';

export interface FetchExternalTimeAllocationQuery {
  filters: {
    externalId: string;
  };
}

export interface CreateTimeAllocationSmartProcessInput {
  externalGroupId?: string;
  externalTaskId: string;
  hours: number;
  isApproved: boolean;
  weekNumber: number;
  year: number;
  externalAssigneeId: string;
  externalAssignerId: string;
}

export interface FetchTimeAllocationsSmartProcessQuery {
  filters: {
    externalUserId: string;
    year: number;
    weekNumber?: number;
    weekNumberFrom?: number;
    weekNumberTo?: number;
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface TimeAllocationSmartProcessProvider {
  create(
    credentials: TenantCredentials,
    smartProcess: SmartProcess,
    input: CreateTimeAllocationSmartProcessInput,
  ): Promise<ExternalTimeAllocation>;
  fetchOrThrow(
    credentials: TenantCredentials,
    smartProcess: SmartProcess,
    query: FetchExternalTimeAllocationQuery,
  ): Promise<ExternalTimeAllocation>;
  fetchMany(
    credentials: TenantCredentials,
    smartProcess: SmartProcess,
    query: FetchTimeAllocationsSmartProcessQuery,
  ): Promise<Page<ExternalTimeAllocation>>;
}
