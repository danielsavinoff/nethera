export class ResolveEntityFailureException extends Error {
  constructor(
    message = 'Failed to resolve entity from Bitrix event.',
  ) {
    super(message);
    this.name = ResolveEntityFailureException.name;
  }
}
