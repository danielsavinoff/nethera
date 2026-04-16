import { Injectable } from '@nestjs/common';
import { ExternalSmartProcessCreationFailedException } from '../../../../application/exceptions/ExternalSmartProcessCreationFailedException.js';
import { ExternalSmartProcessNotFoundException } from '../../../../application/exceptions/ExternalSmartProcessNotFoundException.js';
import { ExternalSmartProcess } from '../../../../application/models/ExternalSmartProcess.js';
import { FetchExternalSmartProcessQuery } from '../../../../application/ports/SmartProcessProvider.js';
import { SmartProcessProvider } from '../../../../application/ports/SmartProcessProvider.js';
import { SmartProcess } from '../../../../domain/smart-process/SmartProcess.js';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixSmartProcessProvider
  implements SmartProcessProvider
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async create(
    credentials: TenantCredentials,
  ): Promise<ExternalSmartProcess> {
    const bitrixSmartProcess =
      await this.bitrixClient.createSmartProcess(
        SmartProcess.defaultTitle,
        credentials,
      );

    if (!bitrixSmartProcess) {
      throw new ExternalSmartProcessCreationFailedException();
    }

    return {
      externalId: String(bitrixSmartProcess.id),
      externalTypeId: String(bitrixSmartProcess.entityTypeId),
      title: bitrixSmartProcess.title,
    };
  }

  async fetchOneOrThrow(
    credentials: TenantCredentials,
    query: FetchExternalSmartProcessQuery,
  ): Promise<ExternalSmartProcess> {
    const bitrixSmartProcess =
      await this.bitrixClient.getSmartProcess(
        query.filters.externalId,
        credentials,
      );

    if (!bitrixSmartProcess) {
      throw new ExternalSmartProcessNotFoundException();
    }

    return {
      externalId: String(
        bitrixSmartProcess.id ?? bitrixSmartProcess.entityTypeId,
      ),
      externalTypeId: String(
        bitrixSmartProcess.entityTypeId ?? bitrixSmartProcess.id,
      ),
      title: bitrixSmartProcess.title,
    };
  }
}
