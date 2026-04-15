import { ApiProperty } from '@nestjs/swagger';
import { GetTimeAllocationResponseDto } from './GetTimeAllocationResponseDto.js';

export class GetTimeAllocationsResponseDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty({
    type: [GetTimeAllocationResponseDto],
  })
  items!: GetTimeAllocationResponseDto[];

  constructor(data: GetTimeAllocationsResponseDto) {
    Object.assign(this, data);
  }
}
