export class ExternalTaskNotFoundException extends Error {
  constructor() {
    super('External task not found');
    this.name = ExternalTaskNotFoundException.name;
  }
}
