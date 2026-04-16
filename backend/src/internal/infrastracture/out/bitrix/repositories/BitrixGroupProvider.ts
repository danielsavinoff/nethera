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
      externalId: String(bitrixGroup.ID),
      name: String(bitrixGroup.NAME),
      active:
        bitrixGroup.ACTIVE === true ||
        bitrixGroup.ACTIVE === 'Y' ||
        bitrixGroup.ACTIVE === 1 ||
        bitrixGroup.ACTIVE === '1',
    };
  }

  async fetchMany(
    credentials: TenantCredentials,
    query: FetchExternalGroupsQuery,
  ): Promise<ExternalGroup[]> {
    const externalIds = query.filters.externalIds;

    if (Array.isArray(externalIds) && externalIds.length === 0) {
      return [];
    }

    const skip = query.page?.skip ?? 0;
    const limit = query.page?.limit;

    const pagedExternalIds = Array.isArray(externalIds)
      ? externalIds.slice(
          skip,
          limit == null ? undefined : skip + limit,
        )
      : undefined;

    const groups: ExternalGroup[] = [];

    if (!pagedExternalIds) {
      const bitrixGroups = await this.bitrixClient.getGroups(
        undefined,
        credentials,
        {
          filters: {
            active: query.filters.active,
          },
          page: {
            limit: limit,
            skip: skip,
          },
        },
      );

      for (const bitrixGroup of bitrixGroups) {
        if (!bitrixGroup.ID) {
          continue;
        }

        groups.push({
          externalId: String(bitrixGroup.ID),
          name: String(bitrixGroup.NAME),
          active:
            bitrixGroup.ACTIVE === true ||
            bitrixGroup.ACTIVE === 'Y' ||
            bitrixGroup.ACTIVE === 1 ||
            bitrixGroup.ACTIVE === '1',
        });
      }

      return groups;
    }

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
          filters: {
            active: query.filters.active,
          },
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
          externalId: String(bitrixGroup.ID),
          name: String(bitrixGroup.NAME),
          active:
            bitrixGroup.ACTIVE === true ||
            bitrixGroup.ACTIVE === 'Y' ||
            bitrixGroup.ACTIVE === 1 ||
            bitrixGroup.ACTIVE === '1',
        });
      }
    }

    return groups;
  }
}
