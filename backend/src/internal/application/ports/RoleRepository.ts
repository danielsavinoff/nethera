import { Role } from '../../domain/authorization/Role.js';
import { UserRole } from '../../domain/authorization/UserRole.js';
import { TransactionContext } from '../models/TransactionContext.js';

export interface RoleRepository {
  loadAll(): Promise<Role[]>;
  loadOrThrow(
    id: Role['id'],
    transactionContext?: TransactionContext,
  ): Promise<Role>;
  loadByName(
    name: UserRole,
    transactionContext?: TransactionContext,
  ): Promise<Role | null>;
  loadByNames(
    names: UserRole[],
    transactionContext?: TransactionContext,
  ): Promise<Role[]>;
}
