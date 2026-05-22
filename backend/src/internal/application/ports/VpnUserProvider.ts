import type { ExternalVpnUser } from '../models/ExternalVpnUser.js';
import type {
  Eq,
  ProviderQuery,
} from '../models/ProviderQuery.js';

export type VpnUserFilter = Eq<'userName', string>;

export interface CreateExternalVpnUserInput {
  userName: string;
  expiresAt?: Date;
}

export interface VpnUserProvider {
  fetch(
    query: ProviderQuery<VpnUserFilter>,
  ): Promise<ExternalVpnUser | null>;
  create(
    input: CreateExternalVpnUserInput,
  ): Promise<ExternalVpnUser>;
}
