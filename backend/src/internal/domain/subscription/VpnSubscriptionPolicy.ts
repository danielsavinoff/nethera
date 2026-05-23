import { Permission } from '../authorization/Permission.js';
import { VpnSubscriptionActionForbiddenException } from './VpnSubscriptionActionForbiddenException.js';

export interface ViewVpnSubscriptionActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewVpnSubscriptionTarget {
  userId: string;
}

export class VpnSubscriptionPolicy {
  assertCanView(
    actor: ViewVpnSubscriptionActor,
    target: ViewVpnSubscriptionTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(
        Permission.VpnSubscriptionViewOwn,
      )
    ) {
      return;
    }

    if (
      actor.permissions.includes(
        Permission.VpnSubscriptionViewAny,
      )
    ) {
      return;
    }

    throw new VpnSubscriptionActionForbiddenException();
  }
}
