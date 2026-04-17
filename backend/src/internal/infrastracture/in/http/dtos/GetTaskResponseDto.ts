import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../../domain/task/TaskStatus.js';

export class GetTaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    enum: TaskStatus,
    enumName: 'TaskStatus',
  })
  status!: TaskStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: GetTaskResponseDto) {
    Object.assign(this, data);
  }
}
