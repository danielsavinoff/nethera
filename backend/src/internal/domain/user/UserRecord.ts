export interface UserRecord {
  id: string;
  externalId: number;
  tenantId: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  language?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
