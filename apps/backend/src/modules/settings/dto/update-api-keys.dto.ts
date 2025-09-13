import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateApiKeysDto {
  @ApiProperty({
    description: '네이버 클라이언트 ID',
    example: 'your_client_id',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '클라이언트 ID는 최소 1자 이상이어야 합니다.' })
  clientId?: string;

  @ApiProperty({
    description: '네이버 클라이언트 시크릿',
    example: 'your_client_secret',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '클라이언트 시크릿은 최소 1자 이상이어야 합니다.' })
  clientSecret?: string;

  @ApiProperty({
    description: '네이버 고객 ID (광고 API용)',
    example: 'your_customer_id',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '고객 ID는 최소 1자 이상이어야 합니다.' })
  customerId?: string;
}
