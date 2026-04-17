import { ApiProperty } from '@nestjs/swagger';
import { GetTaskResponseDto } from './GetTaskResponseDto.js';

export class GetTasksResponseDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty({
    type: [GetTaskResponseDto],
  })
  items!: GetTaskResponseDto[];

  constructor(data: GetTasksResponseDto) {
    Object.assign(this, data);
  }
}
