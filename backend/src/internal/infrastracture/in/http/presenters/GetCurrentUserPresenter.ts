import { Injectable } from '@nestjs/common';
import { GetCurrentUserResult } from '../../../../application/usecases/GetCurrentUserUseCase.js';
import { GetCurrentUserResponseDto } from '../dtos/GetCurrentUserResponseDto.js';

@Injectable()
export class GetCurrentUserPresenter {
  present(
    result: GetCurrentUserResult,
  ): GetCurrentUserResponseDto {
    return new GetCurrentUserResponseDto({
      displayName: result.user.displayName,
      id: result.user.id,
      tenantId: result.user.tenantId,
      language: result.user.language,
    });
  }
}
