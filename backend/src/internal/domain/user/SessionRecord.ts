export interface SessionRecord {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}
