import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateCurrentUserLocaleResponseDto {
  @Expose()
  @ApiProperty()
  locale!: string;

  constructor(data: UpdateCurrentUserLocaleResponseDto) {
    Object.assign(this, data);
  }
}
