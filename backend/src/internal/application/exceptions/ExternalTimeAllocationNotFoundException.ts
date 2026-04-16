export class ExternalTimeAllocationNotFoundException extends Error {
  constructor() {
    super('External time allocation not found');
    this.name = ExternalTimeAllocationNotFoundException.name;
  }
}
