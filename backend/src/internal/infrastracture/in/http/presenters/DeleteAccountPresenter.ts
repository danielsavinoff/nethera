import { Injectable } from '@nestjs/common';
import { DeleteAccountResult } from '../../../../application/usecases/DeleteAccountUseCase.js';
import { DeleteAccountResponseDto } from '../dtos/DeleteAccountResponseDto.js';

@Injectable()
export class DeleteAccountPresenter {
  present(
    result: DeleteAccountResult,
  ): DeleteAccountResponseDto {
    return new DeleteAccountResponseDto({
      id: result.data.user.id,
      isDeleted: result.data.user.isDeleted,
      deletedAt: result.data.user.deletedAt,
    });
  }
}
