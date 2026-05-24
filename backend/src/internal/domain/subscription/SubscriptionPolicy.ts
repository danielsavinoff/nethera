import { Permission } from '../authorization/Permission.js';
import { SubscriptionActionForbiddenException } from './SubscriptionActionForbiddenException.js';

export interface ViewSubscriptionActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewSubscriptionTarget {
  userId: string;
}

export interface CancelSubscriptionActor {
  userId: string;
  permissions: Permission[];
}

export interface CancelSubscriptionTarget {
  userId: string;
}

export class SubscriptionPolicy {
  assertCanView(
    actor: ViewSubscriptionActor,
    target: ViewSubscriptionTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(Permission.SubscriptionViewOwn)
    ) {
      return;
    }

    if (
      actor.permissions.includes(Permission.SubscriptionViewAny)
    ) {
      return;
    }

    throw new SubscriptionActionForbiddenException();
  }

  assertCanCancel(
    actor: CancelSubscriptionActor,
    target: CancelSubscriptionTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(
        Permission.SubscriptionCancelOwn,
      )
    ) {
      return;
    }

    if (
      actor.permissions.includes(
        Permission.SubscriptionCancelAny,
      )
    ) {
      return;
    }

    throw new SubscriptionActionForbiddenException();
  }
}
