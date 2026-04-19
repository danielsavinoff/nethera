import type { AuthClaim } from '../models/AuthClaim.js';
import type { IssuedRefreshToken } from '../models/IssuedRefreshToken.js';

export interface RefreshTokenService {
  issue(claims: AuthClaim): Promise<IssuedRefreshToken>;
  verify(token: string): Promise<AuthClaim>;
}
