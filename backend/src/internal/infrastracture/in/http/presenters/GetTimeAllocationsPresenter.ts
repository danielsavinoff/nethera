import { Injectable } from '@nestjs/common';
import { GetTimeAllocationsResult } from '../../../../application/usecases/GetTimeAllocationsUseCase.js';
import { GetTimeAllocationGroupResponseDto } from '../dtos/GetTimeAllocationGroupResponseDto.js';
import { GetTimeAllocationResponseDto } from '../dtos/GetTimeAllocationResponseDto.js';
import { GetTimeAllocationTaskResponseDto } from '../dtos/GetTimeAllocationTaskResponseDto.js';
import { GetTimeAllocationsResponseDto } from '../dtos/GetTimeAllocationsResponseDto.js';

@Injectable()
export class GetTimeAllocationsPresenter {
  present(
    result: GetTimeAllocationsResult,
  ): GetTimeAllocationsResponseDto {
    const pagination = result.pagination;
    const data = result.data;

    return new GetTimeAllocationsResponseDto({
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      items: !data
        ? []
        : data.items.map(
            (item) =>
              new GetTimeAllocationResponseDto({
                task: new GetTimeAllocationTaskResponseDto({
                  id: item.externalTask.externalId,
                  title: item.externalTask.title,
                  groupId: item.externalTask.externalGroupId,
                }),
                group: new GetTimeAllocationGroupResponseDto({
                  id: item.externalGroup.externalId,
                  name: item.externalGroup.name,
                }),
                id: item.externalTimeAllocation.externalId,
                groupId:
                  item.externalTimeAllocation.externalGroupId,
                taskId:
                  item.externalTimeAllocation.externalTaskId,
                hours: item.externalTimeAllocation.hours,
                isApproved:
                  item.externalTimeAllocation.isApproved,
                weekNumber:
                  item.externalTimeAllocation.weekNumber,
                year: item.externalTimeAllocation.year,
                assigneeId:
                  item.externalTimeAllocation.externalAssigneeId,
                assignerId:
                  item.externalTimeAllocation.externalAssignerId,
              }),
          ),
    });
  }
}
