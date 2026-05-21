import { Payment } from '../../domain/subscription/Payment.js';
import { PaymentRecord } from '../../domain/subscription/PaymentRecord.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadPaymentQuery {
  filters:
    | { id: PaymentRecord['id'] }
    | {
        provider: PaymentRecord['provider'];
        externalId: PaymentRecord['externalId'];
      };
}

export interface LoadPaymentsQuery {
  filters?: {
    userId?: PaymentRecord['userId'];
    status?: PaymentRecord['status'];
    provider?: PaymentRecord['provider'];
    externalId?: PaymentRecord['externalId'];
  };
  page?: {
    limit?: number;
    skip?: number;
  };
}

export interface PaymentRepository {
  load(
    query: LoadPaymentQuery,
    transactionContext?: TransactionContext,
  ): Promise<Payment | null>;
  loadOrThrow(
    query: LoadPaymentQuery,
    transactionContext?: TransactionContext,
  ): Promise<Payment>;
  loadMany(
    query: LoadPaymentsQuery,
    transactionContext?: TransactionContext,
  ): Promise<Payment[]>;
  save(
    payment: Payment,
    transactionContext?: TransactionContext,
  ): Promise<Payment>;
}
