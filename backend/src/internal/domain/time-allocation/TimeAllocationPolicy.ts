import { Permission } from '../authorization/Permission.js';
import { User } from '../user/User.js';
import { TimeAllocationActionForbiddenException } from './TimeAllocationActionForbiddenException.js';

export class TimeAllocationPolicy {
  assertCanView(actor: User): void {
    if (actor.hasPermission(Permission.TimeAllocationViewAny)) {
      return;
    }

    throw new TimeAllocationActionForbiddenException();
  }

  assertCanAdd(actor: User): void {
    if (actor.hasPermission(Permission.TimeAllocationAddAny)) {
      return;
    }

    throw new TimeAllocationActionForbiddenException();
  }
}
