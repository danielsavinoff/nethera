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
import { CreatePlanFeatureRequestDto } from './CreatePlanFeatureRequestDto.js';
import { CreatePlanTranslationRequestDto } from './CreatePlanTranslationRequestDto.js';

export class CreatePlanRequestDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsString()
  priceAmount!: string;

  @ApiProperty()
  @IsString()
  priceCurrency!: string;

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
    type: [CreatePlanTranslationRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanTranslationRequestDto)
  translations?: CreatePlanTranslationRequestDto[];

  @ApiProperty({
    required: false,
    type: [CreatePlanFeatureRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanFeatureRequestDto)
  features?: CreatePlanFeatureRequestDto[];
}
