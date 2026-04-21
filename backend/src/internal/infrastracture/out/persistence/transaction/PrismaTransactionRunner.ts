import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionRunner } from '../../../../application/ports/TransactionRunner.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { PrismaTransactionContext } from './PrismaTransactionContext.js';

@Injectable()
export class PrismaTransactionRunner implements TransactionRunner {
  constructor(private readonly prisma: PrismaClient) {}

  run<T>(
    fn: (tx: TransactionContext) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (client) => {
      const transactionContext = new PrismaTransactionContext(
        client,
      );

      return fn(transactionContext);
    });
  }
}
