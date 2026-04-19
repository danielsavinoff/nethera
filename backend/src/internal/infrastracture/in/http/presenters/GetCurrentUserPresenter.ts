import { Injectable } from '@nestjs/common';
import { GetCurrentUserResult } from '../../../../application/usecases/GetCurrentUserUseCase.js';
import { GetCurrentUserResponseDto } from '../dtos/GetCurrentUserResponseDto.js';
import { Permission } from '../../../../domain/authorization/Permission.js';

@Injectable()
export class GetCurrentUserPresenter {
  present(
    result: GetCurrentUserResult,
  ): GetCurrentUserResponseDto {
    const permissions = [
      ...new Set(
        (result.user.roles ?? []).flatMap((role) =>
          role.getAllPermissions().map(
            (permission) => permission.name,
          ),
        ),
      ),
    ] as Permission[];

    return new GetCurrentUserResponseDto({
      displayName: result.user.displayName,
      id: result.user.id,
      language: result.user.language,
      permissions,
    });
  }
}
