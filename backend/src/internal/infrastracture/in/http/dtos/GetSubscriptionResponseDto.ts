import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  planId!: string;

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

  @ApiProperty({ required: false })
  provider?: string;

  @ApiProperty({ required: false })
  providerCustomerId?: string;

  @ApiProperty({ required: false })
  providerSubscriptionId?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: GetSubscriptionResponseDto) {
    Object.assign(this, data);
  }
}
