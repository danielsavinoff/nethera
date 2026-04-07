export type TenantId = TenantRecord['id'];

export interface TenantRecord {
  id: string;
  domain: string;
  memberId: string;
  isAdmin: boolean;
  refreshToken: string;
  accessToken: string;
  accessTokenTtlSeconds: number;
  accessTokenRefreshedAt: Date;
  isInstalled: boolean;
  createdAt: Date;
  updatedAt: Date;
  serverEndpoint?: string;
  clientEndpoint?: string;
  applicationToken?: string;
}
