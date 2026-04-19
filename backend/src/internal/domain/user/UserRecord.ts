export interface UserRecord {
  id: string;
  email: string;
  language?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
