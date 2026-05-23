export interface SubscriptionPriceRecord {
  id: string;
  subscriptionPlanId: string;
  amountMinor: number;
  currency: string;
  locale: string;
  active: boolean;
  createdAt: Date;
}
