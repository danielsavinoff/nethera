import { ApiProperty } from '@nestjs/swagger';
import { GetTimeAllocationGroupResponseDto } from './GetTimeAllocationGroupResponseDto.js';
import { GetTimeAllocationTaskResponseDto } from './GetTimeAllocationTaskResponseDto.js';

export class GetTimeAllocationResponseDto {
  @ApiProperty({ type: GetTimeAllocationTaskResponseDto })
  task!: GetTimeAllocationTaskResponseDto;

  @ApiProperty({ type: GetTimeAllocationGroupResponseDto })
  group!: GetTimeAllocationGroupResponseDto;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  groupId!: string;

  @ApiProperty()
  taskId!: string;

  @ApiProperty()
  hours!: number;

  @ApiProperty()
  isApproved!: boolean;

  @ApiProperty()
  weekNumber!: number;

  @ApiProperty()
  year!: number;

  @ApiProperty()
  assigneeId!: string;

  @ApiProperty()
  assignerId!: string;

  constructor(data: GetTimeAllocationResponseDto) {
    Object.assign(this, data);
  }
}
