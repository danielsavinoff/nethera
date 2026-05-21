export interface SubscriptionPlanTranslationRecord {
  id: string;
  subscriptionPlanId: string;
  language: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
