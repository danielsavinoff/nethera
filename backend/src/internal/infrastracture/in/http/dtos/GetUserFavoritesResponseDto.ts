import { ApiProperty } from '@nestjs/swagger';
import { GetUserFavoriteResponseDto } from './GetUserFavoriteResponseDto.js';

export class GetUserFavoritesResponseDto {
  @ApiProperty({
    type: [GetUserFavoriteResponseDto],
  })
  favorites!: GetUserFavoriteResponseDto[];

  constructor(data: GetUserFavoritesResponseDto) {
    Object.assign(this, data);
  }
}
