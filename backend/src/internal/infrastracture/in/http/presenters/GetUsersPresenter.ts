import { Injectable } from '@nestjs/common';
import { GetUsersResult } from '../../../../application/usecases/GetUsersUseCase.js';
import { GetUserResponseDto } from '../dtos/GetUserResponseDto.js';
import { GetUsersResponseDto } from '../dtos/GetUsersResponseDto.js';

@Injectable()
export class GetUsersPresenter {
  present(result: GetUsersResult): GetUsersResponseDto {
    return new GetUsersResponseDto({
      total: result.total,
      page: result.page,
      limit: result.limit,
      users: result.users.map(
        (user) =>
          new GetUserResponseDto({
            id: user.id,
            displayName: user.displayName,
            isDeleted: user.isDeleted,
          }),
      ),
    });
  }
}
