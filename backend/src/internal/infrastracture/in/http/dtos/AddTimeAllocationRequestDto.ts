import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AddTimeAllocationRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(1)
  taskId!: string;

  @ApiProperty({ minimum: 0 })
  @IsDefined()
  @IsNumber()
  @Min(0)
  hours!: number;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  isApproved!: boolean;

  @ApiProperty({ minimum: 1, maximum: 53 })
  @IsDefined()
  @IsInt()
  @Min(1)
  @Max(53)
  weekNumber!: number;

  @ApiProperty({ minimum: 1 })
  @IsDefined()
  @IsInt()
  @Min(1)
  year!: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  assigneeId!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  assignerId!: string;
}
