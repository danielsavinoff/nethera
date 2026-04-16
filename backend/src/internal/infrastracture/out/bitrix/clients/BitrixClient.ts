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

interface BitrixCrmItemField {
  type?: string;
  settings?: Record<string, unknown>;
}

interface BitrixCreatedUserField {
  id?: number | string;
  fieldName?: string;
}

interface BitrixDepartment {
  ID: number | string;
  NAME: string;
  PARENT?: number | string | null;
}

interface BitrixTask {
  id?: number | string;
  title?: string;
  groupId?: number | string | null;
}

interface BitrixGroup {
  ID?: number | string;
  NAME?: string;
  ACTIVE?: boolean | string | number;
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

    return Promise.resolve(client);
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
    const response = await client.callMethod('user.current');

    const data = response.getData();
    const result = data.result as UserBrief;

    return result;
  }

  async getCrmItems(
    context: TenantCredentials,
    input: {
      entityTypeId: string;
      filter?: Record<string, unknown>;
      start?: number;
      limit?: number;
      useOriginalUfNames?: boolean;
    },
  ): Promise<{
    items: Record<string, unknown>[];
    total: number;
  }> {
    const client = await this.fromAuthContext(context);
    const result = await client.callMethod(
      'crm.item.list',
      {
        entityTypeId: Number(input.entityTypeId),
        ...(input.filter ? { filter: input.filter } : {}),
        ...(typeof input.limit === 'number'
          ? { limit: input.limit }
          : {}),
        ...(input.useOriginalUfNames
          ? { useOriginalUfNames: 'Y' }
          : {}),
      },
      input.start ?? 0,
    );

    const response = result.getData() as {
      result?: {
        items?: Record<string, unknown>[];
      };
      items?: Record<string, unknown>[];
      total?: number;
    };
    const items = response.result?.items ?? response.items ?? [];
    const total = Number(
      result.getTotal?.() ?? response.total ?? items.length,
    );

    return {
      items,
      total,
    };
  }

  async getTask(
    id: string,
    context: TenantCredentials,
  ): Promise<BitrixTask | null> {
    const client = await this.fromAuthContext(context);
    const response = await client.callMethod('tasks.task.list', {
      filter: {
        ID: Number(id),
      },
      select: ['ID', 'TITLE', 'GROUP_ID'],
    });

    const data = response.getData() as {
      result?: {
        tasks?: BitrixTask[];
      };
      tasks?: BitrixTask[];
    };
    const result = data.result;

    return result?.tasks?.at(0) ?? null;
  }

  async getTasks(
    ids: string[],
    context: TenantCredentials,
    query?: {
      page?: {
        limit?: number;
        skip?: number;
      };
    },
  ): Promise<BitrixTask[]> {
    if (ids.length === 0) {
      return [];
    }

    const skip = query?.page?.skip ?? 0;
    const limit = query?.page?.limit;

    const client = await this.fromAuthContext(context);
    const response = await client.callMethod(
      'tasks.task.list',
      {
        filter: {
          ID: ids.map(Number),
        },
        select: ['ID', 'TITLE', 'GROUP_ID'],
        ...(typeof limit === 'number' ? { limit } : {}),
      },
      skip,
    );

    const data = response.getData() as {
      result?: {
        tasks?: BitrixTask[];
      };
    };
    const result = data.result;

    return result?.tasks ?? [];
  }

  async getGroup(
    id: string,
    context: TenantCredentials,
  ): Promise<BitrixGroup | null> {
    const client = await this.fromAuthContext(context);
    const response = await client.callMethod('sonet_group.get', {
      FILTER: {
        GROUP_ID: Number(id),
      },
    });

    const data = response.getData() as {
      result?: BitrixGroup[];
    };
    const result = data.result?.at(0) ?? null;

    return result;
  }

  async getGroups(
    ids: string[] | undefined,
    context: TenantCredentials,
    query?: {
      filters?: {
        active?: boolean;
      };
      page?: {
        limit?: number;
        skip?: number;
      };
    },
  ): Promise<BitrixGroup[]> {
    if (Array.isArray(ids) && ids.length === 0) {
      return [];
    }

    const skip = query?.page?.skip ?? 0;
    const limit = query?.page?.limit;

    const client = await this.fromAuthContext(context);
    const response = await client.callMethod(
      'sonet_group.get',
      {
        FILTER: {
          ...(Array.isArray(ids)
            ? { GROUP_ID: ids.map(Number) }
            : {}),
          ...(query?.filters?.active === true
            ? { ACTIVE: 'Y' }
            : {}),
        },
        ...(typeof limit === 'number' ? { LIMIT: limit } : {}),
      },
      skip,
    );

    const data = response.getData() as {
      result?: BitrixGroup[];
    };
    const result = data.result;

    return result ?? [];
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

  async getSmartProcessByEntityTypeId(
    entityTypeId: string,
    context: TenantCredentials,
  ): Promise<BitrixSmartProcess | null> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod(
      'crm.type.getByEntityTypeId',
      {
        entityTypeId: Number(entityTypeId),
      },
    );

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

  async getCrmItemFields(
    entityTypeId: number,
    context: TenantCredentials,
  ): Promise<Record<string, BitrixCrmItemField>> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod('crm.item.fields', {
      entityTypeId,
      useOriginalUfNames: 'N',
    });

    const response = result.getData() as {
      result?: {
        fields?: Record<string, BitrixCrmItemField>;
      };
      fields?: Record<string, BitrixCrmItemField>;
    };

    return response.result?.fields ?? response.fields ?? {};
  }

  async createSmartProcessField(
    context: TenantCredentials,
    input: {
      smartProcessId: string;
      fieldName: string;
      labels: Record<string, string>;
      userTypeId: string;
      settings?: Record<string, unknown>;
    },
  ): Promise<BitrixCreatedUserField | null> {
    const client = await this.fromAuthContext(context);

    const result = await client.callMethod(
      'userfieldconfig.add',
      {
        moduleId: 'crm',
        field: {
          entityId: `CRM_${input.smartProcessId}`,
          fieldName: input.fieldName,
          userTypeId: input.userTypeId,
          editFormLabel: input.labels,
          ...(input.settings
            ? { settings: input.settings }
            : {}),
        },
      },
    );

    const response = result.getData() as {
      result?: {
        field?: BitrixCreatedUserField;
      } & BitrixCreatedUserField;
      field?: BitrixCreatedUserField;
    };

    return (
      response.result?.field ??
      response.field ??
      (response.result &&
      typeof response.result.fieldName === 'string'
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
