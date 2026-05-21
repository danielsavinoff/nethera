export interface SubscriptionPlanRecord {
  id: string;
  code: string;
  billingInterval: string;
  billingIntervalCount: number;
  trialDays?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
