export interface AuthTokenRecord {
  id: string;
  email: string;
  tokenHash: string;
  requestedIp?: string;
  requestedUserAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
}
