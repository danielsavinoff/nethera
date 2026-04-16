export class ExternalTimeAllocationCreationFailedException extends Error {
  constructor() {
    super('External time allocation creation failed');
    this.name =
      ExternalTimeAllocationCreationFailedException.name;
  }
}
