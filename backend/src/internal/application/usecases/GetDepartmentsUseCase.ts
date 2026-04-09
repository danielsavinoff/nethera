import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import type { ExternalDepartment } from '../models/ExternalDepartment.js';
import type { DepartmentProvider } from '../ports/DepartmentProvider.js';
import type { TenantRepository } from '../ports/TenantRepository.js';

export type GetDepartmentsCommand = {
  tenantId: TenantRecord['id'];
};

export interface GetDepartmentsResult {
  departments: ExternalDepartment[];
}

export class GetDepartmentsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly departmentProvider: DepartmentProvider,
  ) {}

  async execute(
    command: GetDepartmentsCommand,
  ): Promise<GetDepartmentsResult> {
    const tenant = await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const departments = await this.departmentProvider.fetchAll(
      tenant.credentials,
    );

    return {
      departments,
    };
  }
}
