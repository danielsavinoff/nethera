import type { MagicLinkToken } from '../models/MagicLinkToken.js';

export interface MagicLinkTokenService {
  create(): MagicLinkToken;
  hash(token: string): string;
}
