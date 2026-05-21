import type { VpnSubscriptionProvider as VpnSubscriptionProviderPort } from './VpnSubscriptionProvider.js';

export enum VpnSubscriptionProvider {
  Remnawave = 'REMNAWAVE',
}

export interface VpnProviderResolver {
  resolve(provider: VpnSubscriptionProvider): VpnSubscriptionProviderPort;
}
