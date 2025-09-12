import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class KeywordResearchDto {
  @ApiProperty({
    description: '분석할 키워드',
    example: '가을제철음식',
  })
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty({
    description: '검색량 포함 여부',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeMetrics?: boolean = true;

  @ApiProperty({
    description: '트렌드 포함 여부',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeTrends?: boolean = true;

  @ApiProperty({
    description: '연관 검색어 포함 여부',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeRelated?: boolean = true;

  @ApiProperty({
    description: '태그 후보 포함 여부',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeTags?: boolean = true;

  @ApiProperty({
    description: '강제 새로고침 여부',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean = false;
}
