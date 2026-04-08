import { Permission } from '../authorization/Permission.js';
import { Role } from '../authorization/Role.js';
import { SynchronizableUserData } from './SynchronizableUserData.js';
import { UserRecord } from './UserRecord.js';
import { UserRolesNotLoadedException } from './UserRolesNotLoadedException.js';

export class User {
  static hydrate(props: UserRecord): User {
    return new User(props);
  }

  static create(props: {
    id?: string;
    externalId: number;
    tenantId: string;
    firstName?: string;
    secondName?: string;
    lastName?: string;
    language?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }): User {
    return new User({
      id: props.id ?? crypto.randomUUID(),
      externalId: props.externalId,
      tenantId: props.tenantId,
      firstName: props.firstName,
      secondName: props.secondName,
      lastName: props.lastName,
      language: props.language,
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

  get externalId(): UserRecord['externalId'] {
    return this.props.externalId;
  }

  get tenantId(): UserRecord['tenantId'] {
    return this.props.tenantId;
  }

  get active(): UserRecord['active'] {
    return this.props.active;
  }

  get displayName(): string {
    const fullName =
      (this.props.firstName ?? '') +
      (this.props.lastName ? ` ${this.props.lastName}` : '');
    const fallback = 'Unnamed user';

    return fullName || fallback;
  }

  get language(): UserRecord['language'] {
    return this.props.language;
  }

  setLanguagePreference(language: string): User {
    return new User(
      {
        ...this.props,
        language: language,
      },
      this.roles,
    );
  }

  syncFromExternal(data: SynchronizableUserData): User {
    return new User(
      {
        ...this.props,
        active: data.active ?? this.props.active,
        firstName: data.firstName,
        secondName: data.secondName,
        lastName: data.lastName,
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
