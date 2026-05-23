import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { ExternalVpnUsage } from '../../../../application/models/ExternalVpnUsage.js';
import type { ProviderQuery } from '../../../../application/models/ProviderQuery.js';
import type {
  VpnUsageFilter,
  VpnUsageProvider,
} from '../../../../application/ports/VpnUsageProvider.js';
import {
  RemnawaveBaseProvider,
  type RemnawaveResponse,
} from '../base/RemnawaveBaseProvider.js';

interface RemnawaveVpnUsageResponseItem {
  date: string;
  total: number | string;
}

@Injectable()
export class RemnawaveVpnUsageProvider
  extends RemnawaveBaseProvider
  implements VpnUsageProvider
{
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    super(configService);
  }

  async fetch(
    query: ProviderQuery<VpnUsageFilter>,
  ): Promise<ExternalVpnUsage> {
    const [externalIdFilter, startDateFilter, endDateFilter] =
      query.filter.and;

    const externalId = externalIdFilter.value;

    const params = new URLSearchParams({
      start: this.formatDate(startDateFilter.value),
      end: this.formatDate(endDateFilter.value),
    });

    const response = await firstValueFrom(
      this.httpService.get<
        RemnawaveResponse<RemnawaveVpnUsageResponseItem[]>
      >(
        this.buildUrl(
          `/api/bandwidth-stats/users/${encodeURIComponent(
            externalId,
          )}/legacy?${params.toString()}`,
        ),
        {
          headers: this.getHeaders(),
        },
      ),
    );

    return {
      externalId,
      usageBytes: this.mapUsageBytes(
        response.data.response ?? [],
      ),
    };
  }

  private mapUsageBytes(
    rows: RemnawaveVpnUsageResponseItem[],
  ): Record<string, number> {
    return rows.reduce<Record<string, number>>((usage, row) => {
      const date = row.date.slice(0, 10);

      const bytes = Number(row.total);

      if (!Number.isFinite(bytes)) {
        return usage;
      }

      usage[date] = (usage[date] ?? 0) + bytes;

      return usage;
    }, {});
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
}
