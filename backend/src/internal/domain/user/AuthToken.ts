import { AuthTokenRecord } from './AuthTokenRecord.js';

export class AuthToken {
  static hydrate(record: AuthTokenRecord): AuthToken {
    return new AuthToken(record);
  }

  static create(props: {
    id?: string;
    email: string;
    tokenHash: string;
    requestedIp?: string;
    requestedUserAgent?: string;
    createdAt?: Date;
    expiresAt: Date;
    usedAt?: Date;
  }): AuthToken {
    return new AuthToken({
      id: props.id ?? crypto.randomUUID(),
      email: props.email,
      tokenHash: props.tokenHash,
      requestedIp: props.requestedIp,
      requestedUserAgent: props.requestedUserAgent,
      createdAt: props.createdAt ?? new Date(),
      expiresAt: props.expiresAt,
      usedAt: props.usedAt,
    });
  }

  private constructor(private readonly props: AuthTokenRecord) {}

  get id(): AuthTokenRecord['id'] {
    return this.props.id;
  }

  get email(): AuthTokenRecord['email'] {
    return this.props.email;
  }

  get expiresAt(): AuthTokenRecord['expiresAt'] {
    return this.props.expiresAt;
  }

  isExpired(referenceDate = new Date()): boolean {
    return this.props.expiresAt <= referenceDate;
  }

  isUsed(): boolean {
    return typeof this.props.usedAt !== 'undefined';
  }

  markAsUsed(usedAt = new Date()): AuthToken {
    return new AuthToken({
      ...this.props,
      usedAt,
    });
  }

  toRecord(): AuthTokenRecord {
    return { ...this.props };
  }
}
