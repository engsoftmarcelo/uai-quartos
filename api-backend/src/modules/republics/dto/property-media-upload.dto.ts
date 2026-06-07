import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PropertyMediaUploadDto {
  @ApiProperty({ example: 'fachada.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsMimeType()
  contentType: string;
}
