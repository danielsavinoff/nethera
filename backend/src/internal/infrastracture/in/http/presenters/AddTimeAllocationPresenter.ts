import { Injectable } from '@nestjs/common';
import { AddTimeAllocationResult } from '../../../../application/usecases/AddTimeAllocationUseCase.js';
import { AddTimeAllocationGroupResponseDto } from '../dtos/AddTimeAllocationGroupResponseDto.js';
import { AddTimeAllocationResponseDto } from '../dtos/AddTimeAllocationResponseDto.js';
import { AddTimeAllocationTaskResponseDto } from '../dtos/AddTimeAllocationTaskResponseDto.js';

@Injectable()
export class AddTimeAllocationPresenter {
  present(
    result: AddTimeAllocationResult,
  ): AddTimeAllocationResponseDto {
    return new AddTimeAllocationResponseDto({
      task: new AddTimeAllocationTaskResponseDto({
        id: result.data.task.id,
        externalId: result.data.task.externalId,
        title: result.data.task.name,
        groupId: result.data.group?.id ?? null,
      }),
      group: result.data.group
        ? new AddTimeAllocationGroupResponseDto({
            id: result.data.group.id,
            externalId: result.data.group.externalId,
            name: result.data.group.name,
          })
        : null,
      id: result.data.timeAllocation.id,
      externalId: result.data.timeAllocation.externalId,
      groupId: result.data.group?.id ?? null,
      taskId: result.data.task.id,
      hours: result.data.timeAllocation.hours,
      isApproved: result.data.timeAllocation.isApproved,
      weekNumber: result.data.timeAllocation.weekNumber,
      year: result.data.timeAllocation.year,
      assigneeId: result.data.assignee.id,
      assignerId: result.data.assigner.id,
    });
  }
}
