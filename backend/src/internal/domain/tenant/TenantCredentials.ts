import { TenantCredentialsRecord } from './TenantCredentialsRecord.js';

export class TenantCredentials {
  static hydrate(
    props: TenantCredentialsRecord,
  ): TenantCredentials {
    return new TenantCredentials(props);
  }

  private constructor(
    private readonly props: TenantCredentialsRecord,
  ) {}

  get accessToken(): TenantCredentialsRecord['accessToken'] {
    return this.props.accessToken;
  }

  get refreshToken(): TenantCredentialsRecord['refreshToken'] {
    return this.props.refreshToken;
  }

  get memberId(): TenantCredentialsRecord['memberId'] {
    return this.props.memberId;
  }

  get domain(): TenantCredentialsRecord['domain'] {
    return this.props.domain;
  }

  get expiresIn(): TenantCredentialsRecord['expiresIn'] {
    return this.props.expiresIn;
  }

  get clientEndpoint(): TenantCredentialsRecord['clientEndpoint'] {
    return this.props.clientEndpoint;
  }
}
