import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionPlanFeatureTranslationRequestDto {
  @ApiProperty()
  @IsString()
  locale!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
