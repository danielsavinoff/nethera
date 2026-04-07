import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';

export enum CredentialProvider {
  Tenant = 'tenant',
}

export interface CredentialProviders {
  [CredentialProvider.Tenant]: TenantCredentials;
}

export type Credentials<
  P extends CredentialProvider = CredentialProvider,
> = CredentialProviders[P];
