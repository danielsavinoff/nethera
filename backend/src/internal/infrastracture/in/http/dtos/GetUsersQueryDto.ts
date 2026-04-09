import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }): unknown => {
    const rawValue: unknown = value;

    if (typeof rawValue === 'undefined') {
      return undefined;
    }

    if (typeof rawValue === 'boolean') {
      return rawValue;
    }

    if (rawValue === 'true') {
      return true;
    }

    if (rawValue === 'false') {
      return false;
    }

    return rawValue;
  })
  active?: boolean;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value === 'undefined') {
      return undefined;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value);
    }

    return value;
  })
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value === 'undefined') {
      return undefined;
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value);
    }

    return value;
  })
  limit?: number;
}
