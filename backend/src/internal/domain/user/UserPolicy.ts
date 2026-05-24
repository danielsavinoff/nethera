import { Permission } from '../authorization/Permission.js';
import { UserActionForbiddenException } from './UserActionForbiddenException.js';

export interface ViewUserActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewUserTarget {
  userId?: string;
  all?: boolean;
}

export interface DeleteUserActor {
  userId: string;
  permissions: Permission[];
}

export interface DeleteUserTarget {
  userId: string;
}

export class UserPolicy {
  assertCanView(
    actor: ViewUserActor,
    target: ViewUserTarget,
  ): void {
    if (
      !target.all &&
      target.userId &&
      actor.userId === target.userId &&
      actor.permissions.includes(Permission.UserViewOwn)
    ) {
      return;
    }

    if (
      target.all &&
      actor.permissions.includes(Permission.UserViewAny)
    ) {
      return;
    }

    throw new UserActionForbiddenException();
  }

  assertCanDelete(
    actor: DeleteUserActor,
    target: DeleteUserTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(Permission.UserDeleteOwn)
    ) {
      return;
    }

    if (actor.permissions.includes(Permission.UserDeleteAny)) {
      return;
    }

    throw new UserActionForbiddenException();
  }
}
