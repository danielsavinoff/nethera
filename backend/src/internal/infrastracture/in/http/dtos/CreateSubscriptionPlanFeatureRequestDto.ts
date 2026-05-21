import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSubscriptionPlanFeatureTranslationRequestDto } from './CreateSubscriptionPlanFeatureTranslationRequestDto.js';

export class CreateSubscriptionPlanFeatureRequestDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    required: false,
    type: [CreateSubscriptionPlanFeatureTranslationRequestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubscriptionPlanFeatureTranslationRequestDto)
  translations?: CreateSubscriptionPlanFeatureTranslationRequestDto[];
}
