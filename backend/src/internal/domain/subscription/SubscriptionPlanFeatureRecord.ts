export interface SubscriptionPlanFeatureRecord {
  id: string;
  subscriptionPlanId: string;
  code: string;
  value?: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
