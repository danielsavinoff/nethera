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
          role
            .getAllPermissions()
            .map((permission) => permission.name),
        ),
      ),
    ] as Permission[];

    return new GetCurrentUserResponseDto({
      displayName: result.user.displayName,
      email: result.user.email,
      id: result.user.id,
      locale: result.user.locale,
      permissions,
    });
  }
}
