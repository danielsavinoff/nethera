import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetCurrentUserResponseDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  tenantId!: string;

  @Expose()
  @ApiProperty()
  displayName!: string;

  @Expose()
  @ApiProperty()
  @Optional()
  language?: string;

  constructor(data: GetCurrentUserResponseDto) {
    Object.assign(this, data);
  }
}
