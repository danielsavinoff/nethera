import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { ExternalUserRepository } from '../../../../application/ports/ExternalUserRepository.js';
import { BitrixClient } from '../clients/BitrixClient.js';
import { ExternalUser } from '../../../../application/models/ExternalUser.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BitrixUserRepository
  implements ExternalUserRepository
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async isAdmin(
    authContext: TenantCredentials,
  ): Promise<boolean> {
    return await this.bitrixClient.isAdmin(authContext);
  }

  async getAllUsers(
    authContext: TenantCredentials,
  ): Promise<ExternalUser[]> {
    const bitrixUsers =
      await this.bitrixClient.getAllBitrixUsers(authContext);

    if (!bitrixUsers) {
      return [] as ExternalUser[];
    }

    return bitrixUsers.map(
      (bitrixUser) =>
        ({
          id: Number(bitrixUser.ID),
          firstName: bitrixUser.NAME ?? undefined,
          secondName: bitrixUser.SECOND_NAME ?? undefined,
          lastName: bitrixUser.LAST_NAME ?? undefined,
          isActive: bitrixUser.ACTIVE,
        }) satisfies ExternalUser,
    );
  }

  async getById(
    externalId: number,
    authContext: TenantCredentials,
  ): Promise<ExternalUser | null> {
    const bitrixUser = await this.bitrixClient.getBitrixUser(
      externalId,
      authContext,
    );

    if (!bitrixUser) {
      return null;
    }

    return {
      id: Number(bitrixUser.ID),
      firstName: bitrixUser.NAME ?? undefined,
      secondName: bitrixUser.SECOND_NAME ?? undefined,
      lastName: bitrixUser.LAST_NAME ?? undefined,
      isActive: bitrixUser.ACTIVE,
    } satisfies ExternalUser;
  }

  async getMe(
    credentials: TenantCredentials,
  ): Promise<ExternalUser> {
    const bitrixUser =
      await this.bitrixClient.getCurrentUser(credentials);

    return {
      id: Number(bitrixUser.ID),
      firstName: bitrixUser.NAME ?? undefined,
      secondName: bitrixUser.SECOND_NAME ?? undefined,
      lastName: bitrixUser.LAST_NAME ?? undefined,
      isActive: bitrixUser.ACTIVE,
    } satisfies ExternalUser;
  }
}
