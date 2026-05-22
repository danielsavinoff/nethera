import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VpnSubscriptionProvider as VpnSubscriptionProviderName } from '../../../../application/ports/VpnProviderResolver.js';

export type RemnawaveResponse<T extends object> = {
  response?: T;
};

@Injectable()
export abstract class RemnawaveBaseProvider {
  protected readonly provider =
    VpnSubscriptionProviderName.Remnawave;

  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly queryToken?: string;

  protected constructor(configService: ConfigService) {
    this.baseUrl = configService.getOrThrow<string>(
      'REMNAWAVE_BASE_URL',
    );
    this.apiToken = configService.getOrThrow<string>(
      'REMNAWAVE_API_TOKEN',
    );
    this.queryToken = configService.get<string | undefined>(
      'REMNAWAVE_QUERY_TOKEN',
    );
  }

  protected buildUrl(path: string): string {
    const baseUrl = this.baseUrl.endsWith('/')
      ? this.baseUrl
      : `${this.baseUrl}/`;

    const normalizedPath = path.startsWith('/')
      ? path.slice(1)
      : path;

    const url = new URL(normalizedPath, baseUrl);

    if (this.queryToken) {
      url.search = url.search
        ? `${url.search}&${this.queryToken}`
        : this.queryToken;
    }

    return url.toString();
  }

  protected getHeaders() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
    };
  }
}
