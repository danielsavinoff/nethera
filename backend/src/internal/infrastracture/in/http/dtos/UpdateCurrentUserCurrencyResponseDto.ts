import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateCurrentUserCurrencyResponseDto {
  @Expose()
  @ApiProperty()
  preferredCurrencyCode!: string;

  constructor(data: UpdateCurrentUserCurrencyResponseDto) {
    Object.assign(this, data);
  }
}
