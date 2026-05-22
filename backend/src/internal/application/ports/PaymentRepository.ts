import { Payment } from '../../domain/subscription/Payment.js';
import { PaymentRecord } from '../../domain/subscription/PaymentRecord.js';
import { PaginatedQuery, Query } from '../models/Query.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface PaymentRepository {
  load(
    query: Query<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment | null>;
  loadOrThrow(
    query: Query<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment>;
  loadMany(
    query: PaginatedQuery<PaymentRecord>,
    transactionContext?: TransactionContext,
  ): Promise<Payment[]>;
  save(
    payment: Payment,
    transactionContext?: TransactionContext,
  ): Promise<Payment>;
}
