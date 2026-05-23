export interface SubscriptionPlanFeatureTranslationRecord {
  id: string;
  subscriptionPlanFeatureId: string;
  locale: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
