import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Interval } from '../../../../domain/time/Interval.js';

export class GetSubscriptionPlansQueryDto {
  @ApiPropertyOptional({ enum: Interval })
  @IsOptional()
  @IsEnum(Interval)
  interval?: Interval;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @IsNumberString()
  count?: string;
}
