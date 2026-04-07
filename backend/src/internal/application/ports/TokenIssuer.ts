import { AuthClaim } from '../models/AuthClaim.js';
import { IssuedTokenSet } from '../models/IssuedTokenSet.js';

export interface IssueTokensData<T extends boolean> {
  claims: AuthClaim;
  includeRefreshToken?: T;
}

export interface TokenIssuer {
  issue<T extends boolean>(
    data: IssueTokensData<T>,
  ): Promise<IssuedTokenSet<T>>;
}
