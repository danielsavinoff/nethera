import { createHash, randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import type { MagicLinkToken } from '../../../../application/models/MagicLinkToken.js';
import type { MagicLinkTokenService } from '../../../../application/ports/MagicLinkTokenService.js';

@Injectable()
export class CryptoMagicLinkTokenService
  implements MagicLinkTokenService
{
  create(): MagicLinkToken {
    const token = randomBytes(32).toString('hex');

    return {
      token,
      tokenHash: this.hash(token),
    };
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
