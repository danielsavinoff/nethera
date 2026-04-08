import { B24OAuth, Result, UserBrief } from '@bitrix24/b24jssdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { SupportedBitrixEvents } from '../enums/SupportedBitrixEventsToModels.js';

interface BitrixSmartProcessType {
  id?: number | string;
  entityTypeId?: number | string;
  title: string;
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

    await client.initIsAdmin();

    return client;
  }

  async getAllBitrixUsers(context: TenantCredentials) {
    const client = await this.fromAuthContext(context);
    const result = (await client.callListMethod(
      'user.get',
    )) as Result<UserBrief[]>;

    return result.getData();
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
  ): Promise<BitrixSmartProcessType | null> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod('crm.type.add', {
      fields: {
        title,
      },
    });

    const response = result.getData() as {
      result?: {
        type?: BitrixSmartProcessType;
      } & BitrixSmartProcessType;
      type?: BitrixSmartProcessType;
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
  ): Promise<BitrixSmartProcessType | null> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod('crm.type.get', {
      id: Number(externalId),
    });

    const response = result.getData() as {
      result?: {
        type?: BitrixSmartProcessType;
      } & BitrixSmartProcessType;
      type?: BitrixSmartProcessType;
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
