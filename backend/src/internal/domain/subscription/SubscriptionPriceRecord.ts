export interface SubscriptionPriceRecord {
  id: string;
  subscriptionPlanId: string;
  amountMinor: number;
  currency: string;
  countryCode: string;
  active: boolean;
  createdAt: Date;
}
