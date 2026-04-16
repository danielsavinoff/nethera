import { Injectable } from '@nestjs/common';
import { ExternalTimeAllocationNotFoundException } from '../../../../application/exceptions/ExternalTimeAllocationNotFoundException.js';
import {
  ExternalTimeAllocation,
  ExternalTimeAllocationCustomFields,
} from '../../../../application/models/ExternalTimeAllocation.js';
import type {
  FetchExternalTimeAllocationQuery,
  FetchTimeAllocationsSmartProcessQuery,
  TimeAllocationSmartProcessProvider,
} from '../../../../application/ports/TimeAllocationSmartProcessProvider.js';
import type { Page } from '../../../../application/models/Page.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixTimeAllocationSmartProcessProvider
  implements TimeAllocationSmartProcessProvider
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetchOrThrow(
    credentials: TenantCredentials,
    externalSmartProcessId: string,
    query: FetchExternalTimeAllocationQuery,
  ): Promise<ExternalTimeAllocation> {
    const response = await this.bitrixClient.getCrmItems(
      credentials,
      {
        entityTypeId: externalSmartProcessId,
        filter: {
          id: Number(query.filters.externalId),
        },
        limit: 1,
      },
    );

    const item = response.items.at(0);

    if (!item) {
      throw new ExternalTimeAllocationNotFoundException();
    }

    return {
      externalAssigneeId: String(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.AssigneeId,
          )
        ],
      ),
      externalAssignerId: String(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.AssignerId,
          )
        ],
      ),
      externalGroupId: String(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.GroupId,
          )
        ],
      ),
      externalTaskId: String(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.TaskId,
          )
        ],
      ),
      [ExternalTimeAllocationCustomFields.Hours]: Number(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.Hours,
          )
        ],
      ),
      [ExternalTimeAllocationCustomFields.IsApproved]:
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.IsApproved,
          )
        ] === 'Y',
      [ExternalTimeAllocationCustomFields.WeekNumber]: Number(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.WeekNumber,
          )
        ],
      ),
      [ExternalTimeAllocationCustomFields.Year]: Number(
        item[
          this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.Year,
          )
        ],
      ),
      externalId: String(item.id),
    };
  }

  async fetchMany(
    credentials: TenantCredentials,
    externalSmartProcessId: string,
    query: FetchTimeAllocationsSmartProcessQuery,
  ): Promise<Page<ExternalTimeAllocation>> {
    const assigneeIdFieldName = this.getFieldName(
      externalSmartProcessId,
      ExternalTimeAllocationCustomFields.AssigneeId,
    );

    const weekNumberFieldName = this.getFieldName(
      externalSmartProcessId,
      ExternalTimeAllocationCustomFields.WeekNumber,
    );

    const yearFieldName = this.getFieldName(
      externalSmartProcessId,
      ExternalTimeAllocationCustomFields.Year,
    );

    const response = await this.bitrixClient.getCrmItems(
      credentials,
      {
        entityTypeId: externalSmartProcessId,
        filter: {
          [assigneeIdFieldName]: query.filters.externalUserId,
          [yearFieldName]: query.filters.year,
          ...(typeof query.filters.weekNumber === 'number'
            ? {
                [weekNumberFieldName]: query.filters.weekNumber,
              }
            : {}),
          ...(typeof query.filters.weekNumberFrom === 'number'
            ? {
                [`>=${weekNumberFieldName}`]:
                  query.filters.weekNumberFrom,
              }
            : {}),
          ...(typeof query.filters.weekNumberTo === 'number'
            ? {
                [`<=${weekNumberFieldName}`]:
                  query.filters.weekNumberTo,
              }
            : {}),
        },
        start: query.page?.skip,
        limit: query.page?.limit,
      },
    );

    return {
      total: response.total,
      items: response.items.map((item) => ({
        externalAssigneeId: String(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.AssigneeId,
            )
          ],
        ),
        externalAssignerId: String(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.AssignerId,
            )
          ],
        ),
        externalGroupId: String(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.GroupId,
            )
          ],
        ),
        externalTaskId: String(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.TaskId,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.Hours]: Number(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.Hours,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.IsApproved]:
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.IsApproved,
            )
          ] === 'Y',
        [ExternalTimeAllocationCustomFields.WeekNumber]: Number(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.WeekNumber,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.Year]: Number(
          item[
            this.getFieldName(
              externalSmartProcessId,
              ExternalTimeAllocationCustomFields.Year,
            )
          ],
        ),
        externalId: String(item.id),
      })),
    };
  }

  private getFieldName(
    smartProcessId: string,
    fieldName: string,
  ): string {
    return `ufCrm${smartProcessId}${fieldName.at(0)?.toUpperCase()}${fieldName.slice(1).toLowerCase()}`;
  }
}
