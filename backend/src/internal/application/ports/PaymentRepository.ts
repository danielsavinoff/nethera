import { Payment } from '../../domain/subscription/Payment.js';
import { PaymentRecord } from '../../domain/subscription/PaymentRecord.js';
import {
  PaginatedRepositoryQuery,
  RepositoryQuery,
} from '../models/RepositoryQuery.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface PaymentRepository {
  load(
    query: RepositoryQuery<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment | null>;
  loadOrThrow(
    query: RepositoryQuery<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment>;
  loadMany(
    query: PaginatedRepositoryQuery<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment[]>;
  save(
    payment: Payment,
    transactionContext?: TransactionContext,
  ): Promise<Payment>;
}
