export interface UserRecord {
  id: string;
  email: string;
  locale?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
