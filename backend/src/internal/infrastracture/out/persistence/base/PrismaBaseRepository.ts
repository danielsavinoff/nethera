import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  Filter,
  FilterOperator,
} from '../../../../application/models/Filter.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export abstract class PrismaBaseRepository {
  protected constructor(
    protected readonly prisma: PrismaClient,
  ) {}

  protected buildWhere<TRecord, TWhereInput>(
    filter: Filter<TRecord>,
    fieldMap: Record<Extract<keyof TRecord, string>, string>,
  ): TWhereInput {
    if ('and' in filter) {
      return {
        AND: filter.and.map((nestedFilter) =>
          this.buildWhere<TRecord, TWhereInput>(
            nestedFilter,
            fieldMap,
          ),
        ),
      } as TWhereInput;
    }

    if ('or' in filter) {
      return {
        OR: filter.or.map((nestedFilter) =>
          this.buildWhere<TRecord, TWhereInput>(
            nestedFilter,
            fieldMap,
          ),
        ),
      } as TWhereInput;
    }

    const field = fieldMap[filter.field];

    if (filter.operator === FilterOperator.In) {
      return {
        [field]: {
          in: filter.value,
        },
      } as TWhereInput;
    }

    return {
      [field]: filter.value,
    } as TWhereInput;
  }

  protected getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
