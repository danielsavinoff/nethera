import { Permission } from '../authorization/Permission.js';
import { PaymentActionForbiddenException } from './PaymentActionForbiddenException.js';

export interface ViewPaymentActor {
  userId: string;
  permissions: Permission[];
}

export interface ViewPaymentTarget {
  userId: string;
}

export class PaymentPolicy {
  assertCanView(
    actor: ViewPaymentActor,
    target: ViewPaymentTarget,
  ): void {
    if (
      actor.userId === target.userId &&
      actor.permissions.includes(Permission.PaymentViewOwn)
    ) {
      return;
    }

    if (actor.permissions.includes(Permission.PaymentViewAny)) {
      return;
    }

    throw new PaymentActionForbiddenException();
  }
}
