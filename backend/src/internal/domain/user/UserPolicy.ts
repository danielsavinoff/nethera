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

export enum UpdateUserField {
  Locale = 'locale',
  Currency = 'currency',
}

export interface UpdateUserActor {
  userId: string;
  permissions: Permission[];
}

export interface UpdateUserTarget {
  userId: string;
  fields: Partial<Record<UpdateUserField, boolean>>;
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

  assertCanUpdate(
    actor: UpdateUserActor,
    target: UpdateUserTarget,
  ): void {
    for (const field of Object.values(UpdateUserField)) {
      if (!target.fields[field]) {
        continue;
      }

      if (field === UpdateUserField.Locale) {
        if (
          actor.permissions.includes(
            Permission.UserLocaleUpdateAny,
          )
        ) {
          continue;
        }

        if (actor.userId === target.userId) {
          if (
            actor.permissions.includes(
              Permission.UserLocaleUpdateOwn,
            )
          ) {
            continue;
          }
        }
      }

      if (field === UpdateUserField.Currency) {
        if (
          actor.permissions.includes(
            Permission.UserCurrencyUpdateAny,
          )
        ) {
          continue;
        }

        if (actor.userId === target.userId) {
          if (
            actor.permissions.includes(
              Permission.UserCurrencyUpdateOwn,
            )
          ) {
            continue;
          }
        }
      }

      throw new UserActionForbiddenException();
    }
  }
}
