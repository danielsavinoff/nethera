import { Prisma } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';

export class PrismaTransactionContext implements TransactionContext {
  constructor(
    public readonly client: Prisma.TransactionClient,
  ) {}
}
