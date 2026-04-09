import type { UserFavoriteRecord } from './UserFavoriteRecord.js';

export class UserFavorite {
  static hydrate(props: UserFavoriteRecord): UserFavorite {
    return new UserFavorite(props);
  }

  static create(props: {
    id?: UserFavoriteRecord['id'];
    favoriterUserId: UserFavoriteRecord['favoriterUserId'];
    favoritedUserId: UserFavoriteRecord['favoritedUserId'];
    createdAt?: UserFavoriteRecord['createdAt'];
  }): UserFavorite {
    return new UserFavorite({
      id: props.id ?? crypto.randomUUID(),
      favoriterUserId: props.favoriterUserId,
      favoritedUserId: props.favoritedUserId,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: UserFavoriteRecord,
  ) {}

  get id(): UserFavoriteRecord['id'] {
    return this.props.id;
  }

  get favoriterUserId(): UserFavoriteRecord['favoriterUserId'] {
    return this.props.favoriterUserId;
  }

  get favoritedUserId(): UserFavoriteRecord['favoritedUserId'] {
    return this.props.favoritedUserId;
  }

  get createdAt(): UserFavoriteRecord['createdAt'] {
    return this.props.createdAt;
  }

  toRecord(): UserFavoriteRecord {
    return { ...this.props };
  }
}
