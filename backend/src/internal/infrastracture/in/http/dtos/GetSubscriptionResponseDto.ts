import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionSummaryPlanResponseDto } from './GetSubscriptionSummaryPlanResponseDto.js';

export class GetSubscriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  startedAt!: Date;

  @ApiProperty({ required: false })
  currentPeriodStartAt?: Date;

  @ApiProperty({ required: false })
  currentPeriodEndAt?: Date;

  @ApiProperty({ required: false })
  trialStartedAt?: Date;

  @ApiProperty({ required: false })
  trialEndsAt?: Date;

  @ApiProperty()
  cancelAtPeriodEnd!: boolean;

  @ApiProperty({ required: false })
  canceledAt?: Date;

  @ApiProperty({ required: false })
  endedAt?: Date;

  @ApiProperty()
  autoRenew!: boolean;

  @ApiProperty({
    required: false,
    type: GetSubscriptionSummaryPlanResponseDto,
  })
  subscriptionPlan?: GetSubscriptionSummaryPlanResponseDto;

  @ApiProperty()
  createdAt!: Date;

  constructor(data: GetSubscriptionResponseDto) {
    Object.assign(this, data);
  }
}
