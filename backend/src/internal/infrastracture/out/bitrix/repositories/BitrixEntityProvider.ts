import { Injectable } from '@nestjs/common';
import {
  EntityProvider,
  ExternalEntityKind,
  FetchExternalEntityQuery,
} from '../../../../application/ports/EntityProvider.js';

import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';
import { ResolveEntityFailureException } from '../exceptions/ResolveEntityFailureException.js';
import { ExternalEntityType } from '../../../../application/models/ExternalEntityType.js';

const DEAL_ENTITY_TYPE_ID = 2;

@Injectable()
export class BitrixEntityProvider implements EntityProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetch(
    credentials: TenantCredentials,
    query: FetchExternalEntityQuery,
  ): Promise<ExternalEntityType> {
    if (query.filters.entityType !== ExternalEntityKind.User) {
      throw new ResolveEntityFailureException();
    }

    const fields = await this.bitrixClient.getCrmItemFields(
      DEAL_ENTITY_TYPE_ID,
      credentials,
    );

    const externalId = fields.assignedById?.type;

    if (!externalId) {
      throw new ResolveEntityFailureException();
    }

    return {
      externalId: externalId,
    };
  }
}
