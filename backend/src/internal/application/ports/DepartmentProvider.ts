import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { Department } from '../models/Department.js';

export interface DepartmentProvider {
  fetchAll(
    credentials: TenantCredentials,
  ): Promise<Department[]>;
}
