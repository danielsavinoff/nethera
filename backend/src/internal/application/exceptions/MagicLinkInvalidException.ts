export class MagicLinkInvalidException extends Error {
  constructor(message = 'Magic link is invalid.') {
    super(message);
    this.name = MagicLinkInvalidException.name;
  }
}
