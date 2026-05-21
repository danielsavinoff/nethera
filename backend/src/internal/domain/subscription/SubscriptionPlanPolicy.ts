import { Permission } from '../authorization/Permission.js';
import { SubscriptionPlanActionForbiddenException } from './SubscriptionPlanActionForbiddenException.js';

export interface ViewSubscriptionPlanActor {
  permissions: Permission[];
}

export type ViewSubscriptionPlanTarget = void;

export interface CreateSubscriptionPlanActor {
  permissions: Permission[];
}

export type CreateSubscriptionPlanTarget = void;

export class SubscriptionPlanPolicy {
  assertCanView(
    actor: ViewSubscriptionPlanActor,
    target: ViewSubscriptionPlanTarget,
  ): void {
    void target;

    if (
      actor.permissions.includes(
        Permission.SubscriptionPlanViewAny,
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
