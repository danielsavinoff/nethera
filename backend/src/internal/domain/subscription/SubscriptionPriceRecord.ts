export interface SubscriptionPriceRecord {
  id: string;
  subscriptionPlanId: string;
  amountMinor: number;
  currencyCode: string;
  active: boolean;
  createdAt: Date;
}
