import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPlanFeatureResponseDto {
  @ApiProperty()
  sortOrder!: number;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(data: GetSubscriptionPlanFeatureResponseDto) {
    Object.assign(this, data);
  }
}
