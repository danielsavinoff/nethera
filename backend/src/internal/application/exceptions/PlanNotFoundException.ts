export class PlanNotFoundException extends Error {
  constructor(message = 'Plan was not found.') {
    super(message);
    this.name = PlanNotFoundException.name;
  }
}
