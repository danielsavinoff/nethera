export class MagicLinkAlreadyUsedException extends Error {
  constructor(message = 'Magic link has already been used.') {
    super(message);
    this.name = MagicLinkAlreadyUsedException.name;
  }
}
