export interface SubscriptionPlanTranslationRecord {
  id: string;
  subscriptionPlanId: string;
  locale: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
