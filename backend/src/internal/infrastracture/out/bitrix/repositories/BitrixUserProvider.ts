import { Injectable } from '@nestjs/common';
import { ExternalUserNotFoundException } from '../../../../application/exceptions/ExternalUserNotFoundException.js';
import type { ExternalUser } from '../../../../application/models/ExternalUser.js';
import type {
  FetchExternalUserQuery,
  FetchExternalUsersQuery,
  UserProvider,
} from '../../../../application/ports/UserProvider.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixUserProvider implements UserProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetchAll(
    credentials: TenantCredentials,
    query: FetchExternalUsersQuery,
  ): Promise<ExternalUser[]> {
    const bitrixUsers = await this.bitrixClient.getBitrixUsers(
      credentials,
      query,
    );

    return bitrixUsers.map((bitrixUser) => ({
      id: Number(bitrixUser.ID),
      firstName: bitrixUser.NAME ?? undefined,
      secondName: bitrixUser.SECOND_NAME ?? undefined,
      lastName: bitrixUser.LAST_NAME ?? undefined,
      isAdmin: false,
      isActive: bitrixUser.ACTIVE,
      departmentIds: bitrixUser.UF_DEPARTMENT?.map(String) ?? [],
    }));
  }

  async fetchOneOrThrow(
    credentials: TenantCredentials,
    query: FetchExternalUserQuery,
  ): Promise<ExternalUser> {
    const bitrixUser = await this.bitrixClient.getBitrixUser(
      query.filters.externalId,
      credentials,
    );

    if (!bitrixUser) {
      throw new ExternalUserNotFoundException();
    }

    return {
      id: Number(bitrixUser.ID),
      firstName: bitrixUser.NAME ?? undefined,
      secondName: bitrixUser.SECOND_NAME ?? undefined,
      lastName: bitrixUser.LAST_NAME ?? undefined,
      isAdmin: false,
      isActive: bitrixUser.ACTIVE,
      departmentIds: bitrixUser.UF_DEPARTMENT?.map(String) ?? [],
    };
  }

  async fetchMe(
    credentials: TenantCredentials,
  ): Promise<ExternalUser> {
    const isAdmin = await this.bitrixClient.isAdmin(credentials);
    const bitrixUser =
      await this.bitrixClient.getCurrentUser(credentials);

    return {
      id: Number(bitrixUser.ID),
      firstName: bitrixUser.NAME ?? undefined,
      secondName: bitrixUser.SECOND_NAME ?? undefined,
      lastName: bitrixUser.LAST_NAME ?? undefined,
      isAdmin,
      isActive: bitrixUser.ACTIVE,
      departmentIds: bitrixUser.UF_DEPARTMENT?.map(String) ?? [],
    };
  }
}
