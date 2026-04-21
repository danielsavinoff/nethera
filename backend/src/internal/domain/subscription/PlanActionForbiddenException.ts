export class PlanActionForbiddenException extends Error {
  constructor(message = 'Plan action is forbidden.') {
    super(message);
    this.name = PlanActionForbiddenException.name;
  }
}
