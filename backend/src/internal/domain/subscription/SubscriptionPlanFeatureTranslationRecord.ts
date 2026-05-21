export interface SubscriptionPlanFeatureTranslationRecord {
  id: string;
  subscriptionPlanFeatureId: string;
  language: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
