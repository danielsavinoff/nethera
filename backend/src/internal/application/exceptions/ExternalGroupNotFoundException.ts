export class ExternalGroupNotFoundException extends Error {
  constructor() {
    super('External group not found');
    this.name = ExternalGroupNotFoundException.name;
  }
}
