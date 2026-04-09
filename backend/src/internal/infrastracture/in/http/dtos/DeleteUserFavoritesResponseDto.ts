import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserFavoritesResponseDto {
  @ApiProperty()
  favoriteId!: string;

  constructor(data: DeleteUserFavoritesResponseDto) {
    Object.assign(this, data);
  }
}
