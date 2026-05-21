import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPlanFeatureTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(
    data: GetSubscriptionPlanFeatureTranslationResponseDto,
  ) {
    Object.assign(this, data);
  }
}
