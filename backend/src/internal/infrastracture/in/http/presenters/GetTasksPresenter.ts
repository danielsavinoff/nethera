import { Injectable } from '@nestjs/common';
import { GetTasksResult } from '../../../../application/usecases/GetTasksUseCase.js';
import { GetTaskResponseDto } from '../dtos/GetTaskResponseDto.js';
import { GetTasksResponseDto } from '../dtos/GetTasksResponseDto.js';

@Injectable()
export class GetTasksPresenter {
  present(result: GetTasksResult): GetTasksResponseDto {
    return new GetTasksResponseDto({
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      items: result.data.tasks.map(
        (task) =>
          new GetTaskResponseDto({
            id: task.id,
            name: task.name,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          }),
      ),
    });
  }
}
