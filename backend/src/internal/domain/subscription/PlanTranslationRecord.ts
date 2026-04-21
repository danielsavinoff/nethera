export interface PlanTranslationRecord {
  id: string;
  planId: string;
  language: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
