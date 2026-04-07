import { Injectable } from '@nestjs/common';
import { GetRolesResult } from '../../../../application/usecases/GetRolesUseCase.js';
import { GetRoleResponseDto } from '../dtos/GetRoleResponseDto.js';
import { GetRolesResponseDto } from '../dtos/GetRolesResponseDto.js';

@Injectable()
export class GetRolesPresenter {
  present(result: GetRolesResult): GetRolesResponseDto {
    return new GetRolesResponseDto({
      roles: result.roles.map(
        (role) =>
          new GetRoleResponseDto({
            id: role.id,
            name: role.name,
          }),
      ),
    });
  }
}
