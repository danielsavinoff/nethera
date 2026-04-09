import { Permission } from '../authorization/Permission.js';
import { UserFavoriteActionForbiddenException } from './UserFavoriteActionForbiddenException.js';
import { User } from './User.js';

export class UserFavoritePolicy {
  assertCanView(actor: User, targetUserId: string): void {
    if (
      actor.id === targetUserId &&
      actor.hasPermission(Permission.UserFavoriteViewOwn)
    ) {
      return;
    }

    throw new UserFavoriteActionForbiddenException();
  }

  assertCanAdd(actor: User, targetUserId: string): void {
    if (
      actor.id === targetUserId &&
      actor.hasPermission(Permission.UserFavoriteAddOwn)
    ) {
      return;
    }

    throw new UserFavoriteActionForbiddenException();
  }

  assertCanDelete(actor: User, targetUserId: string): void {
    if (
      actor.id === targetUserId &&
      actor.hasPermission(Permission.UserFavoriteDeleteOwn)
    ) {
      return;
    }

    throw new UserFavoriteActionForbiddenException();
  }
}
