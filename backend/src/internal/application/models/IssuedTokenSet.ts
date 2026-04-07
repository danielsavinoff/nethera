export interface AccessTokenOnly {
  accessToken: string;
  accessTokenExpiresIn: number;
}

export interface AccessAndRefreshTokens extends AccessTokenOnly {
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

export type IssuedTokenSet<T extends boolean> = T extends true
  ? AccessAndRefreshTokens
  : AccessTokenOnly;
