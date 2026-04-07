import { AuthClaim } from '../models/AuthClaim.js';

export interface TokenVerifier {
  verifyRefreshToken(token: string): Promise<AuthClaim>;
  verifyAccessToken(token: string): Promise<AuthClaim>;
}
