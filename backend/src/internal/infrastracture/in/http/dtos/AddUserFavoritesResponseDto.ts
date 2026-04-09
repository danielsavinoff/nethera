import { ApiProperty } from '@nestjs/swagger';

export class AddUserFavoritesResponseDto {
  @ApiProperty()
  favoriteId!: string;

  @ApiProperty()
  favoriteUserId!: string;

  constructor(data: AddUserFavoritesResponseDto) {
    Object.assign(this, data);
  }
}
