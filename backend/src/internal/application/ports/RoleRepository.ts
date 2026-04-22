import { Role } from '../../domain/authorization/Role.js';
import { UserRole } from '../../domain/authorization/UserRole.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface LoadRoleQuery {
  filters:
    | { id: Role['id'] }
    | { name: UserRole };
}

export interface LoadRolesQuery {
  filters?: {
    names?: UserRole[];
  };
}

export interface RoleRepository {
  load(
    query: LoadRoleQuery,
    transactionContext?: TransactionContext,
  ): Promise<Role | null>;
  loadMany(
    query: LoadRolesQuery,
    transactionContext?: TransactionContext,
  ): Promise<Role[]>;
  loadOrThrow(
    query: LoadRoleQuery,
    transactionContext?: TransactionContext,
  ): Promise<Role>;
}
