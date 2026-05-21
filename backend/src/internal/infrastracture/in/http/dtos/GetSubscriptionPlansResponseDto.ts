import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionPlanResponseDto } from './GetSubscriptionPlanResponseDto.js';

export class GetSubscriptionPlansResponseDto {
  @ApiProperty({
    type: [GetSubscriptionPlanResponseDto],
  })
  subscriptionPlans!: GetSubscriptionPlanResponseDto[];

  constructor(data: GetSubscriptionPlansResponseDto) {
    Object.assign(this, data);
  }
}
