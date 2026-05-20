export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startedAt: Date;
  currentPeriodStartAt?: Date;
  currentPeriodEndAt?: Date;
  trialStartedAt?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  endedAt?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
