import { Permission } from '../authorization/Permission.js';
import { SubscriptionInvoiceActionForbiddenException } from './SubscriptionInvoiceActionForbiddenException.js';

export interface ViewSubscriptionInvoiceActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewSubscriptionInvoiceTarget {
  userId: string;
}

export class SubscriptionInvoicePolicy {
  assertCanView(
    actor: ViewSubscriptionInvoiceActor,
    target: ViewSubscriptionInvoiceTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(
        Permission.SubscriptionInvoiceViewOwn,
      )
    ) {
      return;
    }

    if (
      actor.permissions.includes(
        Permission.SubscriptionInvoiceViewAny,
      )
    ) {
      return;
    }

    throw new SubscriptionInvoiceActionForbiddenException();
  }
}
