import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Permission } from '../../../../domain/authorization/Permission.js';

export class GetCurrentUserResponseDto {
  @Expose()
  @ApiProperty()
  id!: string;

  @Expose()
  @ApiProperty()
  displayName!: string;

  @Expose()
  @ApiProperty()
  email!: string;

  @Expose()
  @ApiProperty()
  @Optional()
  language?: string;

  @Expose()
  @ApiProperty({
    enum: Permission,
    isArray: true,
  })
  permissions!: Permission[];

  constructor(data: GetCurrentUserResponseDto) {
    Object.assign(this, data);
  }
}
