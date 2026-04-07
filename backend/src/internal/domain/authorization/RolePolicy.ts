import { Permission } from './Permission.js';
import { User } from '../user/User.js';
import { RoleActionForbiddenException } from './RoleActionForbiddenException.js';

export class RolePolicy {
  assertCanView(actor: User, targetUserId: string): void {
    if (
      actor.id === targetUserId &&
      actor.hasPermission(Permission.UserRoleViewOwn)
    ) {
      return;
    }

    if (actor.hasPermission(Permission.UserRoleViewAny)) {
      return;
    }

    throw new RoleActionForbiddenException();
  }

  assertCanAssign(actor: User): void {
    if (actor.hasPermission(Permission.UserRoleUpdateAny)) {
      return;
    }

    throw new RoleActionForbiddenException();
  }

  assertCanRemove(actor: User): void {
    if (actor.hasPermission(Permission.UserRoleDeleteAny)) {
      return;
    }

    throw new RoleActionForbiddenException();
  }
}
