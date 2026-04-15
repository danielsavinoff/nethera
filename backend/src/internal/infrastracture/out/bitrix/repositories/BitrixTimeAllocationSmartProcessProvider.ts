import { Injectable } from '@nestjs/common';
import {
  ExternalTimeAllocation,
  ExternalTimeAllocationCustomFields,
} from '../../../../application/models/ExternalTimeAllocation.js';
import type {
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

  async fetchMany(
    credentials: TenantCredentials,
    smartProcessExternalId: string,
    query: FetchTimeAllocationsSmartProcessQuery,
  ): Promise<Page<ExternalTimeAllocation>> {
    const smartProcess =
      await this.bitrixClient.getSmartProcessByEntityTypeId(
        smartProcessExternalId,
        credentials,
      );

    const fallbackSmartProcess = smartProcess
      ? null
      : await this.bitrixClient.getSmartProcess(
          smartProcessExternalId,
          credentials,
        );

    const resolvedSmartProcess =
      smartProcess ?? fallbackSmartProcess;

    const smartProcessId =
      resolvedSmartProcess?.id == null
        ? smartProcessExternalId
        : String(resolvedSmartProcess.id);

    const assigneeIdFieldName = this.getFieldName(
      smartProcessId,
      ExternalTimeAllocationCustomFields.AssigneeId,
    );

    const weekNumberFieldName = this.getFieldName(
      smartProcessId,
      ExternalTimeAllocationCustomFields.WeekNumber,
    );

    const yearFieldName = this.getFieldName(
      smartProcessId,
      ExternalTimeAllocationCustomFields.Year,
    );

    const response = await this.bitrixClient.getCrmItems(
      credentials,
      {
        entityTypeId: smartProcessExternalId,
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
              smartProcessId,
              ExternalTimeAllocationCustomFields.AssigneeId,
            )
          ],
        ),
        externalAssignerId: String(
          item[
            this.getFieldName(
              smartProcessId,
              ExternalTimeAllocationCustomFields.AssignerId,
            )
          ],
        ),
        externalGroupId: String(
          item[
            this.getFieldName(
              smartProcessId,
              ExternalTimeAllocationCustomFields.GroupId,
            )
          ],
        ),
        externalTaskId: String(
          item[
            this.getFieldName(
              smartProcessId,
              ExternalTimeAllocationCustomFields.TaskId,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.Hours]: Number(
          item[
            this.getFieldName(
              smartProcessId,
              ExternalTimeAllocationCustomFields.Hours,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.IsApproved]:
          item[
            this.getFieldName(
              smartProcessId,
              ExternalTimeAllocationCustomFields.IsApproved,
            )
          ] === 'Y',
        [ExternalTimeAllocationCustomFields.WeekNumber]: Number(
          item[
            this.getFieldName(
              smartProcessId,
              ExternalTimeAllocationCustomFields.WeekNumber,
            )
          ],
        ),
        [ExternalTimeAllocationCustomFields.Year]: Number(
          item[
            this.getFieldName(
              smartProcessId,
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
