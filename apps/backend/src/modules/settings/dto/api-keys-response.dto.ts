import { ApiProperty } from '@nestjs/swagger';

export class ApiKeysResponseDto {
  @ApiProperty({
    description: '모든 API 키가 설정되었는지 여부',
    example: true,
  })
  isConfigured: boolean;

  @ApiProperty({
    description: '클라이언트 ID 설정 여부',
    example: true,
  })
  hasClientId: boolean;

  @ApiProperty({
    description: '클라이언트 시크릿 설정 여부',
    example: true,
  })
  hasClientSecret: boolean;

  @ApiProperty({
    description: '고객 ID 설정 여부',
    example: true,
  })
  hasCustomerId: boolean;

  @ApiProperty({
    description: '마스킹된 클라이언트 ID',
    example: 'abcd****efgh',
  })
  clientIdMasked: string;

  @ApiProperty({
    description: '마스킹된 클라이언트 시크릿',
    example: 'wxyz****1234',
  })
  clientSecretMasked: string;

  @ApiProperty({
    description: '마스킹된 고객 ID',
    example: '1234****5678',
  })
  customerIdMasked: string;
}
