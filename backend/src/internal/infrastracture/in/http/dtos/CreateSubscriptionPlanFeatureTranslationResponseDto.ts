import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionPlanFeatureTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(
    data: CreateSubscriptionPlanFeatureTranslationResponseDto,
  ) {
    Object.assign(this, data);
  }
}
