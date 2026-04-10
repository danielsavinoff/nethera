import { B24OAuth, Result, UserBrief } from '@bitrix24/b24jssdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { SupportedBitrixEvents } from '../enums/SupportedBitrixEventsToModels.js';
import type { FetchExternalUsersQuery } from '../../../../application/ports/UserProvider.js';

interface BitrixSmartProcess {
  id?: number | string;
  entityTypeId?: number | string;
  title: string;
}

interface BitrixDepartment {
  ID: number | string;
  NAME: string;
  PARENT?: number | string | null;
}

@Injectable()
export class BitrixClient {
  constructor(private readonly configService: ConfigService) {}

  private async fromAuthContext(context: TenantCredentials) {
    const client = new B24OAuth(
      // TODO: Wrong type definitions in b24jssdk
      // @ts-expect-error Wrong type definitions in b24jssdk
      {
        accessToken: context.accessToken,
        refreshToken: context.refreshToken,
        memberId: context.memberId,
        domain: context.domain,
        expiresIn: context.expiresIn,
        clientEndpoint: `https://${context.domain}/rest`,
        serverEndpoint: this.configService.getOrThrow(
          'B24_OAUTH_DOMAIN',
        ),
      },
      {
        clientId: this.configService.getOrThrow('B24_CLIENT_ID'),
        clientSecret: this.configService.getOrThrow(
          'B24_CLIENT_SECRET',
        ),
      },
    );

    return client;
  }

  async getBitrixUsers(
    context: TenantCredentials,
    query: FetchExternalUsersQuery,
  ): Promise<UserBrief[]> {
    const { filters } = query;

    if (
      Array.isArray(filters?.externalIds) &&
      filters.externalIds.length === 0
    ) {
      return [];
    }

    const client = await this.fromAuthContext(context);
    const filter: Record<string, unknown> = {};

    if (filters?.externalIds) {
      filter.ID = filters.externalIds;
    }

    const params: Record<string, unknown> = {};

    if (Object.keys(filter).length > 0) {
      params.filter = filter;
    }

    if (filters?.departmentExternalId) {
      params.UF_DEPARTMENT = Number(
        filters.departmentExternalId,
      );
    }

    const result = (await client.callListMethod(
      'user.get',
      params,
    )) as Result<UserBrief[]>;

    return result.getData() ?? [];
  }

  async getDepartments(
    context: TenantCredentials,
  ): Promise<BitrixDepartment[]> {
    const client = await this.fromAuthContext(context);

    const result = (await client.callListMethod(
      'department.get',
    )) as Result<BitrixDepartment[]>;

    return result.getData() ?? [];
  }

  async isAdmin(context: TenantCredentials) {
    const client = await this.fromAuthContext(context);

    return client.auth.isAdmin;
  }

  async subscribeTenantToWebhook(context: TenantCredentials) {
    const client = await this.fromAuthContext(context);
    const events = Object.values(SupportedBitrixEvents);
    const handler = `https://${this.configService.getOrThrow('VIRTUAL_HOST')}/api/bitrix/webhook`;

    const calls = events.flatMap((event) => [
      [
        'event.unbind',
        {
          event,
          handler,
        },
      ],
      [
        'event.bind',
        {
          event,
          handler,
        },
      ],
    ]);

    return ((await client.callBatch(calls)) as Result<boolean>)
      .isSuccess;
  }

  async getBitrixUser(
    bitrixUserId: number,
    context: TenantCredentials,
  ) {
    const client = await this.fromAuthContext(context);
    const result = (await client.callListMethod('user.get', {
      filter: {
        id: bitrixUserId,
      },
    })) as Result<UserBrief[]>;

    return result.getData()?.at(0);
  }

  async getCurrentUser(context: TenantCredentials) {
    const client = await this.fromAuthContext(context);
    const result = await client.callMethod('user.current');

    return result.getData().result as UserBrief;
  }

  async sendNotification(
    userId: number,
    message: string,
    context: TenantCredentials,
  ) {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod(
      'im.notify.system.add',
      {
        user_id: userId,
        message: message,
      },
    );

    return result.getData();
  }

  async createSmartProcess(
    title: string,
    context: TenantCredentials,
  ): Promise<BitrixSmartProcess | null> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod('crm.type.add', {
      fields: {
        title,
      },
    });

    const response = result.getData() as {
      result?: {
        type?: BitrixSmartProcess;
      } & BitrixSmartProcess;
      type?: BitrixSmartProcess;
    };

    return (
      response.result?.type ??
      response.type ??
      (response.result &&
      typeof response.result.title === 'string'
        ? response.result
        : null)
    );
  }

  async getSmartProcess(
    externalId: string,
    context: TenantCredentials,
  ): Promise<BitrixSmartProcess | null> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod('crm.type.get', {
      id: Number(externalId),
    });

    const response = result.getData() as {
      result?: {
        type?: BitrixSmartProcess;
      } & BitrixSmartProcess;
      type?: BitrixSmartProcess;
    };

    return (
      response.result?.type ??
      response.type ??
      (response.result &&
      typeof response.result.title === 'string'
        ? response.result
        : null)
    );
  }

  async refresh(context: TenantCredentials) {
    const client = await this.fromAuthContext(context);
    const credentials = await client.auth.refreshAuth();

    return credentials;
  }
}
