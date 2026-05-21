import type { ExternalVpnSubscription } from '../models/ExternalVpnSubscription.js';

export interface CreateVpnSubscriptionInput {
  userName: string;
  expiresAt?: Date;
}

export interface VpnSubscriptionProvider {
  create(
    input: CreateVpnSubscriptionInput,
  ): Promise<ExternalVpnSubscription>;
}
