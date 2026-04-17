export interface GroupRecord {
  id: string;
  name: string;
  externalId: string;
  tenantId: string;
  active: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
