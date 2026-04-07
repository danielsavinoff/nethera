import { Injectable } from '@nestjs/common';
import { GetUserRolesResult } from '../../../../application/usecases/GetUserRolesUseCase.js';
import { GetUserRoleResponseDto } from '../dtos/GetUserRoleResponseDto.js';
import { GetUserRolesResponseDto } from '../dtos/GetUserRolesResponseDto.js';

@Injectable()
export class GetUserRolesPresenter {
  present(result: GetUserRolesResult): GetUserRolesResponseDto {
    return new GetUserRolesResponseDto({
      roles: result.roles.map(
        (role) =>
          new GetUserRoleResponseDto({
            roleId: role.id,
            roleName: role.name,
          }),
      ),
    });
  }
}
