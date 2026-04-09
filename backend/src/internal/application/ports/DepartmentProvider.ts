import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { ExternalDepartment } from '../models/ExternalDepartment.js';

export interface DepartmentProvider {
  fetchAll(
    credentials: TenantCredentials,
  ): Promise<ExternalDepartment[]>;
}
