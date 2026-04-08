import { Injectable } from '@nestjs/common';
import { ExternalSmartProcessCreationFailedException } from '../../../../application/exceptions/ExternalSmartProcessCreationFailedException.js';
import { ExternalSmartProcessNotFoundException } from '../../../../application/exceptions/ExternalSmartProcessNotFoundException.js';
import { ExternalSmartProcess } from '../../../../application/models/ExternalSmartProcess.js';
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
      id: String(
        bitrixSmartProcess.entityTypeId ?? bitrixSmartProcess.id,
      ),
      title: bitrixSmartProcess.title,
    };
  }

  async findByExternalId(
    externalId: string,
    credentials: TenantCredentials,
  ): Promise<ExternalSmartProcess> {
    const bitrixSmartProcess =
      await this.bitrixClient.getSmartProcess(
        externalId,
        credentials,
      );

    if (!bitrixSmartProcess) {
      throw new ExternalSmartProcessNotFoundException();
    }

    return {
      id: String(
        bitrixSmartProcess.entityTypeId ?? bitrixSmartProcess.id,
      ),
      title: bitrixSmartProcess.title,
    };
  }
}
