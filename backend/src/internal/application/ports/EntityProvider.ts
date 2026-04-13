import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { ExternalEntity } from '../models/ExternalEntity.js';

export enum ExternalEntityType {
  User = 'user',
}

export interface FetchExternalEntityQuery {
  filters: {
    entityType: ExternalEntityType;
  };
}

export interface EntityProvider {
  fetch(
    credentials: TenantCredentials,
    query: FetchExternalEntityQuery,
  ): Promise<ExternalEntity>;
}
