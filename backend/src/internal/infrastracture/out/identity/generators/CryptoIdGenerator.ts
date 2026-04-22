import { Injectable } from '@nestjs/common';

import type { IdGenerator } from '../../../../application/ports/IdGenerator.js';

@Injectable()
export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
