import type { RoleRecord } from './RoleRecord.js';
import { RolePermission } from './RolePermission.js';
import { UserRole } from './UserRole.js';

export class Role {
  static hydrate(props: RoleRecord): Role {
    return new Role(props);
  }

  static create(props: {
    id?: RoleRecord['id'];
    name: RoleRecord['name'];
    createdAt?: RoleRecord['createdAt'];
    updatedAt?: RoleRecord['updatedAt'];
  }): Role {
    return new Role({
      id: props.id ?? crypto.randomUUID(),
      name: props.name,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: RoleRecord,
    private readonly permissions?: RolePermission[],
  ) {}

  get id(): RoleRecord['id'] {
    return this.props.id;
  }

  get name(): UserRole {
    return this.props.name as UserRole;
  }

  getAllPermissions(): RolePermission[] {
    return this.permissions ?? [];
  }

  withPermissions(permissions: RolePermission[]): Role {
    return new Role(this.props, permissions);
  }

  toRecord(): RoleRecord {
    return {
      ...this.props,
    };
  }
}
