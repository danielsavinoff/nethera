import { Injectable } from '@nestjs/common';
import { GetDepartmentUsersResult } from '../../../../application/usecases/GetDepartmentUsersUseCase.js';
import { GetDepartmentUsersResponseDto } from '../dtos/GetDepartmentUsersResponseDto.js';
import { GetUserResponseDto } from '../dtos/GetUserResponseDto.js';

@Injectable()
export class GetDepartmentUsersPresenter {
  present(
    result: GetDepartmentUsersResult,
  ): GetDepartmentUsersResponseDto {
    return new GetDepartmentUsersResponseDto({
      users: result.users.map(
        (user) =>
          new GetUserResponseDto({
            id: user.id,
            displayName: user.displayName,
            active: user.active,
          }),
      ),
    });
  }
}
