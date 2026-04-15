import { Injectable } from '@nestjs/common';
import type { ExternalDepartment } from '../../../../application/models/ExternalDepartment.js';
import type { DepartmentProvider } from '../../../../application/ports/DepartmentProvider.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixDepartmentProvider
  implements DepartmentProvider
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetchAll(
    credentials: TenantCredentials,
  ): Promise<ExternalDepartment[]> {
    const bitrixDepartments =
      await this.bitrixClient.getDepartments(credentials);

    return bitrixDepartments.map(
      (bitrixDepartment) =>
        ({
          externalId: String(bitrixDepartment.ID),
          externalParentId:
            bitrixDepartment.PARENT == null
              ? undefined
              : String(bitrixDepartment.PARENT),
          name: bitrixDepartment.NAME,
        }) satisfies ExternalDepartment,
    );
  }
}
