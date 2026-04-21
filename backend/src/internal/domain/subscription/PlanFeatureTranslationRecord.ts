export interface PlanFeatureTranslationRecord {
  id: string;
  planFeatureId: string;
  language: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
