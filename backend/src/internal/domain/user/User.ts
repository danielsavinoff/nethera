import { Permission } from '../authorization/Permission.js';
import { Role } from '../authorization/Role.js';
import { UserRecord } from './UserRecord.js';
import { UserRolesNotLoadedException } from './UserRolesNotLoadedException.js';

export class User {
  static hydrate(props: UserRecord): User {
    return new User(props);
  }

  static create(props: {
    id?: string;
    email: string;
    locale?: string;
    preferredCurrencyCode?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }): User {
    return new User({
      id: props.id ?? crypto.randomUUID(),
      email: props.email,
      locale: props.locale,
      preferredCurrencyCode: props.preferredCurrencyCode,
      isDeleted: props.isDeleted ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? undefined,
    });
  }

  private constructor(
    private readonly props: UserRecord,
    public readonly roles?: Role[],
  ) {}

  get id(): UserRecord['id'] {
    return this.props.id;
  }

  get email(): UserRecord['email'] {
    return this.props.email;
  }

  get isDeleted(): UserRecord['isDeleted'] {
    return this.props.isDeleted;
  }

  get displayName(): string {
    return this.props.email || 'Unnamed user';
  }

  get locale(): UserRecord['locale'] {
    return this.props.locale;
  }

  get preferredCurrencyCode(): UserRecord['preferredCurrencyCode'] {
    return this.props.preferredCurrencyCode;
  }

  get deletedAt(): UserRecord['deletedAt'] {
    return this.props.deletedAt;
  }

  setLocalePreference(locale: string): User {
    const now = new Date();

    return new User(
      {
        ...this.props,
        locale: locale,
        updatedAt: now,
      },
      this.roles,
    );
  }

  setPreferredCurrencyCode(preferredCurrencyCode: string): User {
    const now = new Date();

    return new User(
      {
        ...this.props,
        preferredCurrencyCode,
        updatedAt: now,
      },
      this.roles,
    );
  }

  isEnrichedWithRoles(): boolean {
    return typeof this.roles !== 'undefined';
  }

  hasPermission(permission: Permission): boolean {
    if (!this.roles) {
      throw new UserRolesNotLoadedException();
    }

    return this.roles.some((role) =>
      role
        .getAllPermissions()
        .some(
          (rolePermission) =>
            rolePermission.name === String(permission),
        ),
    );
  }

  withRoles(roles: Role[]): User {
    return new User(this.props, roles);
  }

  delete(): User {
    const now = new Date();

    return new User(
      {
        ...this.props,
        isDeleted: true,
        deletedAt: now,
        updatedAt: now,
      },
      this.roles,
    );
  }

  toRecord(): UserRecord {
    return { ...this.props };
  }
}
