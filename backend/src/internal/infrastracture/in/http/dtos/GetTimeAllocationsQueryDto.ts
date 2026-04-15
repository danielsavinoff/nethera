import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class GetTimeAllocationsQueryDto {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  userId!: string;

  @ApiProperty({ type: Number, minimum: 1 })
  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  year!: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @ValidateIf(
    (query: GetTimeAllocationsQueryDto) =>
      typeof query.weekNumberFrom === 'undefined' &&
      typeof query.weekNumberTo === 'undefined',
  )
  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  weekNumber?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @ValidateIf(
    (query: GetTimeAllocationsQueryDto) =>
      typeof query.weekNumber === 'undefined' ||
      typeof query.weekNumberFrom !== 'undefined',
  )
  @IsDefined()
  @ValidateIf(
    (query: GetTimeAllocationsQueryDto) =>
      typeof query.weekNumber === 'undefined',
  )
  @IsInt()
  @Min(1)
  @Type(() => Number)
  weekNumberFrom?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @ValidateIf(
    (query: GetTimeAllocationsQueryDto) =>
      typeof query.weekNumber === 'undefined',
  )
  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  weekNumberTo?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
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
  @Type(() => Number)
  limit?: number;
}
