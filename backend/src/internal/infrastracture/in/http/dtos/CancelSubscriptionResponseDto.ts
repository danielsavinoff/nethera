import { ApiProperty } from '@nestjs/swagger';

export class CancelSubscriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ required: false })
  canceledAt?: Date;

  @ApiProperty({ required: false })
  endedAt?: Date;

  constructor(data: CancelSubscriptionResponseDto) {
    Object.assign(this, data);
  }
}
