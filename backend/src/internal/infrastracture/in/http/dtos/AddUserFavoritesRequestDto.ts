import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddUserFavoritesRequestDto {
  @ApiProperty()
  @IsString()
  favoriteUserId!: string;
}
