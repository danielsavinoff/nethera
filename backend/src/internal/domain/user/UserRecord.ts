export interface UserRecord {
  id: string;
  email: string;
  locale?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
