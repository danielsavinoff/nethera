import { ApiProperty } from '@nestjs/swagger';

export class GetUserFavoriteResponseDto {
  @ApiProperty()
  favoriteId!: string;

  @ApiProperty()
  favoriteUserId!: string;

  @ApiProperty()
  createdAt!: Date;

  constructor(data: GetUserFavoriteResponseDto) {
    Object.assign(this, data);
  }
}
