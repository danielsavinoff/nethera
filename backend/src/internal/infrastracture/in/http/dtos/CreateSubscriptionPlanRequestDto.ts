import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingInterval } from '../../../../domain/subscription/BillingInterval.js';
import { CreateSubscriptionPlanFeatureRequestDto } from './CreateSubscriptionPlanFeatureRequestDto.js';
import { CreateSubscriptionPlanTranslationRequestDto } from './CreateSubscriptionPlanTranslationRequestDto.js';
import { CreateSubscriptionPriceRequestDto } from './CreateSubscriptionPriceRequestDto.js';

export class CreateSubscriptionPlanRequestDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty({
    enum: BillingInterval,
  })
  @IsEnum(BillingInterval)
  billingInterval!: BillingInterval;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  billingIntervalCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  trialDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    required: false,
    type: [CreateSubscriptionPlanTranslationRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubscriptionPlanTranslationRequestDto)
  translations?: CreateSubscriptionPlanTranslationRequestDto[];

  @ApiProperty({
    required: false,
    type: [CreateSubscriptionPlanFeatureRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubscriptionPlanFeatureRequestDto)
  features?: CreateSubscriptionPlanFeatureRequestDto[];

  @ApiProperty({
    required: false,
    type: [CreateSubscriptionPriceRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubscriptionPriceRequestDto)
  prices?: CreateSubscriptionPriceRequestDto[];
}
