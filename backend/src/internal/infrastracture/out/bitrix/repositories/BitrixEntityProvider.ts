import { Injectable } from '@nestjs/common';
import {
  EntityProvider,
  ExternalEntityType,
  FetchExternalEntityQuery,
} from '../../../../application/ports/EntityProvider.js';
import { ExternalEntity } from '../../../../application/models/ExternalEntity.js';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';
import { ResolveEntityFailureException } from '../exceptions/ResolveEntityFailureException.js';

const DEAL_ENTITY_TYPE_ID = 2;

@Injectable()
export class BitrixEntityProvider implements EntityProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetch(
    credentials: TenantCredentials,
    query: FetchExternalEntityQuery,
  ): Promise<ExternalEntity> {
    if (query.filters.entityType !== ExternalEntityType.User) {
      throw new ResolveEntityFailureException();
    }

    const fields = await this.bitrixClient.getCrmItemFields(
      DEAL_ENTITY_TYPE_ID,
      credentials,
    );

    const typeId = fields.assignedById?.type;

    if (!typeId) {
      throw new ResolveEntityFailureException();
    }

    return {
      typeId,
    };
  }
}
