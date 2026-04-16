import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ExternalEntityType } from '../models/ExternalEntityType.js';

export enum ExternalEntityKind {
  User = 'user',
}

export interface FetchExternalEntityQuery {
  filters: {
    entityType: ExternalEntityKind;
  };
}

export interface EntityProvider {
  fetch(
    credentials: TenantCredentials,
    query: FetchExternalEntityQuery,
  ): Promise<ExternalEntityType>;
}
