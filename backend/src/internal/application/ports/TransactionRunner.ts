import { TransactionContext } from '../models/TransactionContext.js';

export interface TransactionRunner {
  run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
