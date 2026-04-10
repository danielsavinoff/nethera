import { UserBrief } from '@bitrix24/b24jssdk';
import { Injectable } from '@nestjs/common';
import type { ExternalUser } from '../../../../application/models/ExternalUser.js';
import type { UserProvider } from '../../../../application/ports/UserProvider.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixUserProvider implements UserProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async isAdmin(
    credentials: TenantCredentials,
  ): Promise<boolean> {
    return await this.bitrixClient.isAdmin(credentials);
  }

  async fetchAll(
    credentials: TenantCredentials,
  ): Promise<ExternalUser[]> {
    const bitrixUsers =
      await this.bitrixClient.getAllBitrixUsers(credentials);

    return bitrixUsers.map((bitrixUser) =>
      this.mapExternalUser(bitrixUser),
    );
  }

  async fetchAllByExternalIds(
    externalIds: number[],
    credentials: TenantCredentials,
  ): Promise<ExternalUser[]> {
    const bitrixUsers = await this.bitrixClient.getAllUsersByIds(
      externalIds,
      credentials,
    );

    return bitrixUsers.map((bitrixUser) =>
      this.mapExternalUser(bitrixUser),
    );
  }

  async fetchByExternalId(
    externalId: number,
    credentials: TenantCredentials,
  ): Promise<ExternalUser | null> {
    const bitrixUser = await this.bitrixClient.getBitrixUser(
      externalId,
      credentials,
    );

    if (!bitrixUser) {
      return null;
    }

    return this.mapExternalUser(bitrixUser);
  }

  async fetchMe(
    credentials: TenantCredentials,
  ): Promise<ExternalUser> {
    const bitrixUser =
      await this.bitrixClient.getCurrentUser(credentials);

    return this.mapExternalUser(bitrixUser);
  }

  private mapExternalUser(bitrixUser: UserBrief): ExternalUser {
    return {
      id: Number(bitrixUser.ID),
      firstName: bitrixUser.NAME ?? undefined,
      secondName: bitrixUser.SECOND_NAME ?? undefined,
      lastName: bitrixUser.LAST_NAME ?? undefined,
      isActive: bitrixUser.ACTIVE,
      departmentIds: bitrixUser.UF_DEPARTMENT.map(String),
    } satisfies ExternalUser;
  }
}
