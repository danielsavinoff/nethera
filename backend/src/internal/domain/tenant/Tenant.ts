import { Duration } from '../time/Duration.js';
import { TenantCredentials } from './TenantCredentials.js';
import type { TenantId, TenantRecord } from './TenantRecord.js';

export class Tenant {
  static hydrate(props: TenantRecord): Tenant {
    return new Tenant(props);
  }

  static create(
    props: Omit<
      TenantRecord,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'accessTokenRefreshedAt'
      | 'isAdmin'
      | 'isInstalled'
    > & {
      id?: TenantRecord['id'];
      createdAt?: TenantRecord['createdAt'];
      updatedAt?: TenantRecord['updatedAt'];
      accessTokenRefreshedAt?: TenantRecord['accessTokenRefreshedAt'];
      isAdmin?: TenantRecord['isAdmin'];
      isInstalled?: TenantRecord['isInstalled'];
    },
  ): Tenant {
    return new Tenant({
      id: props.id ?? crypto.randomUUID(),
      domain: props.domain,
      memberId: props.memberId,
      isAdmin: props.isAdmin ?? false,
      refreshToken: props.refreshToken,
      accessToken: props.accessToken,
      accessTokenTtlSeconds: props.accessTokenTtlSeconds,
      accessTokenRefreshedAt:
        props.accessTokenRefreshedAt ?? new Date(),
      isInstalled: props.isInstalled ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      serverEndpoint: props.serverEndpoint,
      clientEndpoint: props.clientEndpoint,
      applicationToken: props.applicationToken,
    });
  }

  private constructor(private readonly props: TenantRecord) {}

  get id(): TenantId {
    return this.props.id;
  }

  get domain(): string {
    return this.props.domain;
  }

  get credentials(): TenantCredentials {
    return TenantCredentials.hydrate({
      accessToken: this.props.accessToken,
      refreshToken: this.props.refreshToken,
      domain: this.props.domain,
      memberId: this.props.memberId,
      expiresIn: this.props.accessTokenTtlSeconds,
      clientEndpoint: this.props.clientEndpoint ?? '',
    });
  }

  get applicationToken(): string | undefined {
    return this.props.applicationToken;
  }

  reconfigure({
    clientEndpoint,
    serverEndpoint,
    applicationToken,
    isInstalled,
  }: {
    clientEndpoint: string;
    serverEndpoint: string;
    applicationToken: string;
    isInstalled: boolean;
  }): Tenant {
    return Tenant.hydrate({
      ...this.props,
      clientEndpoint,
      serverEndpoint,
      applicationToken,
      isInstalled,
      updatedAt: new Date(),
    });
  }

  refreshCredentials(credentials: TenantCredentials): Tenant {
    return Tenant.hydrate({
      ...this.props,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      accessTokenTtlSeconds: credentials.expiresIn,
      accessTokenRefreshedAt: new Date(),
      clientEndpoint: credentials.clientEndpoint,
      updatedAt: new Date(),
    });
  }

  toRecord(): TenantRecord {
    return { ...this.props };
  }

  shouldRefresh(): boolean {
    const now = new Date();

    const isTokenExpired = Duration.seconds(
      this.props.accessTokenTtlSeconds,
    ).addTo(this.props.accessTokenRefreshedAt);

    return isTokenExpired <= now;
  }
}
