import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { TenantSmartProcessAlreadyExistsException } from '../../../../application/exceptions/TenantSmartProcessAlreadyExistsException.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { SmartProcessRepository } from '../../../../application/ports/SmartProcessRepository.js';
import { SmartProcess } from '../../../../domain/smart-process/SmartProcess.js';
import { TenantRecord } from '../../../../domain/tenant/TenantRecord.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaSmartProcessRepository
  implements SmartProcessRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async save(
    smartProcess: SmartProcess,
    transactionContext?: TransactionContext,
  ): Promise<SmartProcess> {
    const client = this.getClient(transactionContext);

    const record = smartProcess.toRecord();

    try {
      const row = await client.smartProcess.upsert({
        where: {
          id: record.id,
        },
        create: {
          id: record.id,
          external_id: record.externalId,
          external_type_id: record.externalTypeId,
          tenant_id: record.tenantId,
        },
        update: {
          external_id: record.externalId,
          external_type_id: record.externalTypeId,
          tenant_id: record.tenantId,
        },
      });

      return SmartProcess.hydrate({
        id: row.id,
        externalId: row.external_id,
        externalTypeId: row.external_type_id,
        tenantId: row.tenant_id,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('tenant_id')
      ) {
        throw new TenantSmartProcessAlreadyExistsException();
      }

      throw error;
    }
  }

  async loadByTenantId(
    tenantId: TenantRecord['id'],
    transactionContext?: TransactionContext,
  ): Promise<SmartProcess | null> {
    const client = this.getClient(transactionContext);

    const row = await client.smartProcess.findUnique({
      where: {
        tenant_id: tenantId,
      },
    });

    if (!row) {
      return null;
    }

    return SmartProcess.hydrate({
      id: row.id,
      externalId: row.external_id,
      externalTypeId: row.external_type_id,
      tenantId: row.tenant_id,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
