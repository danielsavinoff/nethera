import { Permission } from '../authorization/Permission.js';
import { SubscriptionActionForbiddenException } from './SubscriptionActionForbiddenException.js';

export interface ViewSubscriptionActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewSubscriptionTarget {
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
}
