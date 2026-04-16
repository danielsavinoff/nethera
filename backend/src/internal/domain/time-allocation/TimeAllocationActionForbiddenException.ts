export class TimeAllocationActionForbiddenException extends Error {
  constructor(
    message = 'You do not have permission to manage time allocations.',
  ) {
    super(message);
    this.name = TimeAllocationActionForbiddenException.name;
  }
}
