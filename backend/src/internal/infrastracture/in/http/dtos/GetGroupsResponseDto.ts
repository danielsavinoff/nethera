import { ApiProperty } from '@nestjs/swagger';
import { GetGroupResponseDto } from './GetGroupResponseDto.js';

export class GetGroupsResponseDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty({
    type: [GetGroupResponseDto],
  })
  items!: GetGroupResponseDto[];

  constructor(data: GetGroupsResponseDto) {
    Object.assign(this, data);
  }
}
