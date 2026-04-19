import { User } from '../../domain/user/User.js';
import { UserRecord } from '../../domain/user/UserRecord.js';
import type { Page } from '../models/Page.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadUserQuery {
  filters:
    | { id: UserRecord['id'] }
    | { email: UserRecord['email'] };
  with?: {
    roles?: boolean;
  };
}

export interface LoadUsersPageQuery {
  filters?: {
    active?: boolean;
    q?: string;
  };
  page: {
    number: number;
    limit: number;
  };
}

export interface UserRepository {
  load(
    query: LoadUserQuery,
    transactionContext?: TransactionContext,
  ): Promise<User | null>;
  loadOrThrow(
    query: LoadUserQuery,
    transactionContext?: TransactionContext,
  ): Promise<User>;
  loadPage(
    query: LoadUsersPageQuery,
  ): Promise<Page<User>>;
  save(
    user: User,
    transactionContext?: TransactionContext,
  ): Promise<User>;
}
