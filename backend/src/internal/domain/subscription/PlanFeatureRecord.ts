export interface PlanFeatureRecord {
  id: string;
  planId: string;
  code: string;
  value?: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
