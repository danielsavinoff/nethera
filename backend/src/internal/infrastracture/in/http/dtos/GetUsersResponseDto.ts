import { ApiProperty } from '@nestjs/swagger';
import { GetUserResponseDto } from './GetUserResponseDto.js';

export class GetUsersResponseDto {
  @ApiProperty({
    type: [GetUserResponseDto],
  })
  users!: GetUserResponseDto[];

  constructor(data: GetUsersResponseDto) {
    Object.assign(this, data);
  }
}
