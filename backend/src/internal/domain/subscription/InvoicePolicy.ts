import { Permission } from '../authorization/Permission.js';
import { InvoiceActionForbiddenException } from './InvoiceActionForbiddenException.js';

export interface ViewInvoiceActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewInvoiceTarget {
  userId: string;
}

export class InvoicePolicy {
  assertCanView(
    actor: ViewInvoiceActor,
    target: ViewInvoiceTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(Permission.InvoiceViewOwn)
    ) {
      return;
    }

    if (actor.permissions.includes(Permission.InvoiceViewAny)) {
      return;
    }

    throw new InvoiceActionForbiddenException();
  }
}
