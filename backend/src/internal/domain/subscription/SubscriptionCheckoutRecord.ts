export interface SubscriptionCheckoutRecord {
  id: string;
  userId: string;
  planId: string;
  status: string;
  provider: string;
  providerSessionId?: string;
  checkoutUrl?: string;
  expiresAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
