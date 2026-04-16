import { ApiProperty } from '@nestjs/swagger';

export class AddTimeAllocationTaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  externalId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  groupId!: string | null;

  constructor(data: AddTimeAllocationTaskResponseDto) {
    Object.assign(this, data);
  }
}
