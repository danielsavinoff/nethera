import { SessionRecord } from './SessionRecord.js';

export class Session {
  static hydrate(props: SessionRecord): Session {
    return new Session(props);
  }

  static create(props: {
    id?: string;
    userId: string;
    refreshToken: string;
    expiresAt: Date;
  }): Session {
    return new Session({
      id: props.id ?? crypto.randomUUID(),
      userId: props.userId,
      refreshToken: props.refreshToken,
      expiresAt: props.expiresAt,
    });
  }

  private constructor(private readonly props: SessionRecord) {}

  get id(): SessionRecord['id'] {
    return this.props.id;
  }

  toRecord(): SessionRecord {
    return { ...this.props };
  }
}
