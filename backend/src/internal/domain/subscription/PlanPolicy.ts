import { Permission } from '../authorization/Permission.js';
import { PlanActionForbiddenException } from './PlanActionForbiddenException.js';

export interface ViewPlanActor {
  permissions: Permission[];
}

export type ViewPlanTarget = void;

export interface CreatePlanActor {
  permissions: Permission[];
}

export type CreatePlanTarget = void;

export class PlanPolicy {
  assertCanView(
    actor: ViewPlanActor,
    target: ViewPlanTarget,
  ): void {
    void target;

    if (actor.permissions.includes(Permission.PlanViewAny)) {
      return;
    }

    throw new PlanActionForbiddenException();
  }

  assertCanCreate(
    actor: CreatePlanActor,
    target: CreatePlanTarget,
  ): void {
    void target;

    if (actor.permissions.includes(Permission.PlanAddAny)) {
      return;
    }

    throw new PlanActionForbiddenException();
  }
}
