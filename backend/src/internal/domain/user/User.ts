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
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }): User {
    return new User({
      id: props.id ?? crypto.randomUUID(),
      email: props.email,
      locale: props.locale,
      active: props.active ?? true,
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

  get active(): UserRecord['active'] {
    return this.props.active;
  }

  get displayName(): string {
    return this.props.email || 'Unnamed user';
  }

  get locale(): UserRecord['locale'] {
    return this.props.locale;
  }

  setLocalePreference(locale: string): User {
    return new User(
      {
        ...this.props,
        locale: locale,
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
          (rolePermission) => rolePermission.name === permission,
        ),
    );
  }

  withRoles(roles: Role[]): User {
    return new User(this.props, roles);
  }

  toRecord(): UserRecord {
    return { ...this.props };
  }
}
