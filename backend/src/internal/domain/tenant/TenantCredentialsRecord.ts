export interface TenantCredentialsRecord {
  accessToken: string;
  refreshToken: string;
  memberId: string;
  domain: string;
  expiresIn: number;
  clientEndpoint: string;
}
