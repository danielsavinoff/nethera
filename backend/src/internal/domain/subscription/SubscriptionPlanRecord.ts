export interface SubscriptionPlanRecord {
  id: string;
  code: string;
  billingInterval: string;
  billingIntervalCount: number;
  trialDays?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
