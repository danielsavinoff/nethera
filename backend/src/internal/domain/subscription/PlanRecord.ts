export interface PlanRecord {
  id: string;
  code: string;
  priceAmount: string;
  priceCurrency: string;
  billingInterval: string;
  billingIntervalCount: number;
  trialDays?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
