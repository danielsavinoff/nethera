import { AuthToken } from '../../domain/user/AuthToken.js';
import type { AuthTokenRecord } from '../../domain/user/AuthTokenRecord.js';

export interface LoadAuthTokenQuery {
  filters: {
    tokenHash: AuthTokenRecord['tokenHash'];
  };
}

export interface AuthTokenRepository {
  load(query: LoadAuthTokenQuery): Promise<AuthToken | null>;
  save(authToken: AuthToken): Promise<AuthToken>;
}
