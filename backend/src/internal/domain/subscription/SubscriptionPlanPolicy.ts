import { Permission } from '../authorization/Permission.js';
import { SubscriptionPlanActionForbiddenException } from './SubscriptionPlanActionForbiddenException.js';

export interface ViewSubscriptionPlanActor {
  permissions: Permission[];
}

export interface ViewSubscriptionPlanTarget {
  onlyPublic: boolean;
}

export interface CreateSubscriptionPlanActor {
  permissions: Permission[];
}

export type CreateSubscriptionPlanTarget = void;

export class SubscriptionPlanPolicy {
  assertCanView(
    actor: ViewSubscriptionPlanActor,
    target: ViewSubscriptionPlanTarget,
  ): void {
    if (
      actor.permissions.includes(
        Permission.SubscriptionPlanViewAny,
      )
    ) {
      return;
    }

    if (
      target.onlyPublic &&
      actor.permissions.includes(
        Permission.SubscriptionPlanViewPublic,
      )
    ) {
      return;
    }

    throw new SubscriptionPlanActionForbiddenException();
  }

  assertCanCreate(
    actor: CreateSubscriptionPlanActor,
    target: CreateSubscriptionPlanTarget,
  ): void {
    void target;

    if (
      actor.permissions.includes(
        Permission.SubscriptionPlanAddAny,
      )
    ) {
      return;
    }

    throw new SubscriptionPlanActionForbiddenException();
  }
}
