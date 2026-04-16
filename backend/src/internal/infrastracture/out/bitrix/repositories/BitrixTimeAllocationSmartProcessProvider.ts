import { Injectable } from '@nestjs/common';
import { ExternalTimeAllocationCreationFailedException } from '../../../../application/exceptions/ExternalTimeAllocationCreationFailedException.js';
import { ExternalTimeAllocationNotFoundException } from '../../../../application/exceptions/ExternalTimeAllocationNotFoundException.js';
import {
  ExternalTimeAllocation,
  ExternalTimeAllocationCustomFields,
} from '../../../../application/models/ExternalTimeAllocation.js';
import type {
  CreateTimeAllocationSmartProcessInput,
  FetchExternalTimeAllocationQuery,
  FetchTimeAllocationsSmartProcessQuery,
  TimeAllocationSmartProcessProvider,
} from '../../../../application/ports/TimeAllocationSmartProcessProvider.js';
import type { Page } from '../../../../application/models/Page.js';
import type { SmartProcess } from '../../../../domain/smart-process/SmartProcess.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

@Injectable()
export class BitrixTimeAllocationSmartProcessProvider
  implements TimeAllocationSmartProcessProvider
{
  constructor(private readonly bitrixClient: BitrixClient) {}

  async create(
    credentials: TenantCredentials,
    smartProcess: SmartProcess,
    input: CreateTimeAllocationSmartProcessInput,
  ): Promise<ExternalTimeAllocation> {
    const externalSmartProcessId = smartProcess.externalId;

    const item = await this.bitrixClient.createCrmItem(
      credentials,
      {
        entityTypeId: smartProcess.externalTypeId,
        fields: {
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.GroupId,
          )]: input.externalGroupId,
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.TaskId,
          )]: input.externalTaskId,
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.Hours,
          )]: input.hours,
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.IsApproved,
          )]: input.isApproved ? 'Y' : 'N',
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.WeekNumber,
          )]: input.weekNumber,
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.Year,
          )]: input.year,
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.AssigneeId,
          )]: input.externalAssigneeId,
          [this.getFieldName(
            externalSmartProcessId,
            ExternalTimeAllocationCustomFields.AssignerId,
          )]: input.externalAssignerId,
        },
      },
    );

    const externalId = item?.id;

    if (
      typeof externalId !== 'string' &&
      typeof externalId !== 'number'
    ) {
      throw new ExternalTimeAllocationCreationFailedException();
    }

    return {
      externalId: String(externalId),
      externalGroupId: input.externalGroupId ?? '',
      externalTaskId: input.externalTaskId,
      hours: input.hours,
      isApproved: input.isApproved,
      weekNumber: input.weekNumber,
      year: input.year,
      externalAssigneeId: input.externalAssigneeId,
      externalAssignerId: input.externalAssignerId,
    };
  }

  async fetchOrThrow(
    credentials: TenantCredentials,
    smartProcess: SmartProcess,
    query: FetchExternalTimeAllocationQuery,
  ): Promise<ExternalTimeAllocation> {
    const externalSmartProcessTypeId =
      smartProcess.externalTypeId;

    const response = await this.bitrixClient.getCrmItems(
      credentials,
      {
        entityTypeId: externalSmartProcessTypeId,
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
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.AssigneeId,
          )
        ],
      ),
      externalAssignerId: String(
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.AssignerId,
          )
        ],
      ),
      externalGroupId: String(
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.GroupId,
          )
        ],
      ),
      externalTaskId: String(
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.TaskId,
          )
        ],
      ),
      [ExternalTimeAllocationCustomFields.Hours]: Number(
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.Hours,
          )
        ],
      ),
      [ExternalTimeAllocationCustomFields.IsApproved]:
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.IsApproved,
          )
        ] === 'Y',
      [ExternalTimeAllocationCustomFields.WeekNumber]: Number(
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.WeekNumber,
          )
        ],
      ),
      [ExternalTimeAllocationCustomFields.Year]: Number(
        item[
          this.getFieldName(
            externalSmartProcessTypeId,
            ExternalTimeAllocationCustomFields.Year,
          )
        ],
      ),
      externalId: String(item.id),
    };
  }

  async fetchMany(
    credentials: TenantCredentials,
    smartProcess: SmartProcess,
    query: FetchTimeAllocationsSmartProcessQuery,
  ): Promise<Page<ExternalTimeAllocation>> {
    const externalSmartProcessTypeId =
      smartProcess.externalTypeId;

    const assigneeIdFieldName = this.getFieldName(
      externalSmartProcessTypeId,
      ExternalTimeAllocationCustomFields.AssigneeId,
    );

    const weekNumberFieldName = this.getFieldName(
      externalSmartProcessTypeId,
      ExternalTimeAllocationCustomFields.WeekNumber,
    );

    const yearFieldName = this.getFieldName(
      externalSmartProcessTypeId,
      ExternalTimeAllocationCustomFields.Year,
    );

    const response = await this.bitrixClient.getCrmItems(
      credentials,
      {
        entityTypeId: externalSmartProcessTypeId,
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
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.AssigneeId,
            )
          ],
        ),
        externalAssignerId: String(
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.AssignerId,
            )
          ],
        ),
        externalGroupId: String(
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.GroupId,
            )
          ],
        ),
        externalTaskId: String(
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.TaskId,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.Hours]: Number(
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.Hours,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.IsApproved]:
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.IsApproved,
            )
          ] === 'Y',
        [ExternalTimeAllocationCustomFields.WeekNumber]: Number(
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
              ExternalTimeAllocationCustomFields.WeekNumber,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.Year]: Number(
          item[
            this.getFieldName(
              externalSmartProcessTypeId,
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
