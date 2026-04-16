import { ApiProperty } from '@nestjs/swagger';
import { AddTimeAllocationGroupResponseDto } from './AddTimeAllocationGroupResponseDto.js';
import { AddTimeAllocationTaskResponseDto } from './AddTimeAllocationTaskResponseDto.js';

export class AddTimeAllocationResponseDto {
  @ApiProperty({ type: AddTimeAllocationTaskResponseDto })
  task!: AddTimeAllocationTaskResponseDto;

  @ApiProperty({
    type: AddTimeAllocationGroupResponseDto,
    nullable: true,
  })
  group!: AddTimeAllocationGroupResponseDto | null;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  externalId!: string;

  @ApiProperty({ nullable: true })
  groupId!: string | null;

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

  constructor(data: AddTimeAllocationResponseDto) {
    Object.assign(this, data);
  }
}
