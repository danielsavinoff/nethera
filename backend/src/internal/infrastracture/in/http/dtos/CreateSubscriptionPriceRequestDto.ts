import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSubscriptionPriceRequestDto {
  @ApiProperty()
  @IsInt()
  amountMinor!: number;

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  currencyCode!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
