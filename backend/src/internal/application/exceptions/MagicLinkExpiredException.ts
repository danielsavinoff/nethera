export class MagicLinkExpiredException extends Error {
  constructor(message = 'Magic link has expired.') {
    super(message);
    this.name = MagicLinkExpiredException.name;
  }
}
