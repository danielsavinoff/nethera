import { Injectable } from '@nestjs/common';
import { GetGroupsResult } from '../../../../application/usecases/GetGroupsUseCase.js';
import { GetGroupResponseDto } from '../dtos/GetGroupResponseDto.js';
import { GetGroupsResponseDto } from '../dtos/GetGroupsResponseDto.js';

@Injectable()
export class GetGroupsPresenter {
  present(result: GetGroupsResult): GetGroupsResponseDto {
    return new GetGroupsResponseDto({
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      items: result.data.groups.map(
        (group) =>
          new GetGroupResponseDto({
            id: group.id,
            name: group.name,
            active: group.active,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
          }),
      ),
    });
  }
}
