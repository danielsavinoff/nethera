export interface VpnSubscriptionRecord {
  id: string;
  provider: string;
  externalId: string;
  subscriptionUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
