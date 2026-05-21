import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionSummaryPlanResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  name?: string;

  constructor(data: GetSubscriptionSummaryPlanResponseDto) {
    Object.assign(this, data);
  }
}
