import { Injectable } from '@nestjs/common';
import type { ExternalGroup } from '../../../../application/models/ExternalGroup.js';
import type {
  FetchExternalGroupQuery,
  FetchExternalGroupsQuery,
  GroupProvider,
} from '../../../../application/ports/GroupProvider.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixGroupProvider implements GroupProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetch(
    credentials: TenantCredentials,
    query: FetchExternalGroupQuery,
  ): Promise<ExternalGroup | null> {
    const bitrixGroup = await this.bitrixClient.getGroup(
      query.filters.externalId,
      credentials,
    );

    if (!bitrixGroup?.ID) {
      return null;
    }

    return {
      id: String(bitrixGroup.ID),
      name: String(bitrixGroup.NAME),
    };
  }

  async fetchMany(
    credentials: TenantCredentials,
    query: FetchExternalGroupsQuery,
  ): Promise<ExternalGroup[]> {
    const externalIds = query.filters.externalIds ?? [];

    if (externalIds.length === 0) {
      return [];
    }

    const skip = query.page?.skip ?? 0;
    const limit = query.page?.limit;

    const pagedExternalIds = externalIds.slice(
      skip,
      limit == null ? undefined : skip + limit,
    );

    const groups: ExternalGroup[] = [];

    for (
      let chunkStart = 0;
      chunkStart < pagedExternalIds.length;
      chunkStart += 50
    ) {
      const chunkExternalIds = pagedExternalIds.slice(
        chunkStart,
        chunkStart + 50,
      );

      const bitrixGroups = await this.bitrixClient.getGroups(
        chunkExternalIds,
        credentials,
        {
          page: {
            limit: chunkExternalIds.length,
            skip: 0,
          },
        },
      );

      for (const bitrixGroup of bitrixGroups) {
        if (!bitrixGroup.ID) {
          continue;
        }

        groups.push({
          id: String(bitrixGroup.ID),
          name: String(bitrixGroup.NAME),
        });
      }
    }

    return groups;
  }
}
