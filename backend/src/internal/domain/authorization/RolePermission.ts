import { RolePermissionRecord } from './RolePermissionRecord.js';

export class RolePermission {
  static hydrate(props: RolePermissionRecord): RolePermission {
    return new RolePermission(props);
  }

  static create(props: {
    roleName: RolePermissionRecord['roleName'];
    permissionName: RolePermissionRecord['permissionName'];
    createdAt?: RolePermissionRecord['createdAt'];
  }): RolePermission {
    return new RolePermission({
      roleName: props.roleName,
      permissionName: props.permissionName,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  private constructor(
    private readonly props: RolePermissionRecord,
  ) {}

  get name(): RolePermissionRecord['permissionName'] {
    return this.props.permissionName;
  }

  toRecord(): RolePermissionRecord {
    return {
      ...this.props,
    };
  }
}
