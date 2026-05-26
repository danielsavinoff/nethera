export interface UserRecord {
  id: string;
  email: string;
  locale?: string;
  preferredCurrencyCode?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
