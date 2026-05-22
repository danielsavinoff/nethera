import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import type { ExternalVpnSubscription } from '../../../../application/models/ExternalVpnSubscription.js';
import type { ProviderQuery } from '../../../../application/models/ProviderQuery.js';
import type {
  CreateVpnSubscriptionInput,
  VpnSubscriptionProvider,
  VpnSubscriptionFilter,
} from '../../../../application/ports/VpnSubscriptionProvider.js';
import {
  RemnawaveBaseProvider,
  type RemnawaveResponse,
} from '../base/RemnawaveBaseProvider.js';
import { Duration } from '../../../../domain/time/Duration.js';

interface RemnawaveGetSubscriptionResponse {
  user: {
    username: string;
    isActive: boolean;
  };
  subscriptionUrl: string;
}

interface RemnawaveCreateSubscriptionResponse {
  uuid: string;
  subscriptionUrl: string;
}

@Injectable()
export class RemnawaveVpnSubscriptionProvider
  extends RemnawaveBaseProvider
  implements VpnSubscriptionProvider
{
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    super(configService);
  }

  async fetch(
    query: ProviderQuery<VpnSubscriptionFilter>,
  ): Promise<ExternalVpnSubscription | null> {
    try {
      const uuid = query.filter.value;

      const response = await firstValueFrom(
        this.httpService.get<
          RemnawaveResponse<RemnawaveGetSubscriptionResponse>
        >(
          this.buildUrl(
            `/api/subscriptions/by-uuid/${encodeURIComponent(uuid)}`,
          ),
          {
            headers: this.getHeaders(),
          },
        ),
      );

      const data = response.data.response;

      if (!data) {
        return null;
      }

      return {
        externalId: uuid,
        provider: this.provider,
        subscriptionUrl: data.subscriptionUrl,
      };
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === 404
      ) {
        return null;
      }

      throw error;
    }
  }

  async create(
    input: CreateVpnSubscriptionInput,
  ): Promise<ExternalVpnSubscription> {
    const now = new Date();

    const expiration =
      input.expiresAt ?? Duration.years(99).addTo(now);

    const response = await firstValueFrom(
      this.httpService.post<
        RemnawaveResponse<RemnawaveCreateSubscriptionResponse>
      >(
        this.buildUrl('/api/users'),
        {
          username: input.userName,
          expireAt: expiration,
        },
        {
          headers: this.getHeaders(),
        },
      ),
    );

    const data = response.data.response!;

    return {
      externalId: data.uuid,
      provider: this.provider,
      subscriptionUrl: data.subscriptionUrl,
    };
  }
}
