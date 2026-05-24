import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  constructor(data: DeleteAccountResponseDto) {
    Object.assign(this, data);
  }
}
