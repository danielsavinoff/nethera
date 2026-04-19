import type { AuthClaim } from '../models/AuthClaim.js';
import type { IssuedAccessToken } from '../models/IssuedAccessToken.js';

export interface AccessTokenService {
  issue(claims: AuthClaim): Promise<IssuedAccessToken>;
  verify(token: string): Promise<AuthClaim>;
}
