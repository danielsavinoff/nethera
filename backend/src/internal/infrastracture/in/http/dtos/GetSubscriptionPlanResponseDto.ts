import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  name?: string;

  constructor(data: GetSubscriptionPlanResponseDto) {
    Object.assign(this, data);
  }
}
