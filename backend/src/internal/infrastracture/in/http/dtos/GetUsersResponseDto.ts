import { ApiProperty } from '@nestjs/swagger';
import { GetUserResponseDto } from './GetUserResponseDto.js';

export class GetUsersResponseDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty({
    type: [GetUserResponseDto],
  })
  users!: GetUserResponseDto[];

  constructor(data: GetUsersResponseDto) {
    Object.assign(this, data);
  }
}
