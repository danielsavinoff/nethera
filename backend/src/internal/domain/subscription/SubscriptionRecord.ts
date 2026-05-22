export interface SubscriptionRecord {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  status: string;
  startedAt: Date;
  expiresAt?: Date;
  trialStartedAt?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
