import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkKeywordResearchDto {
  @ApiProperty({
    description: '초기 검색할 키워드',
    example: '가을제철음식',
  })
  @IsString()
  @IsNotEmpty()
  initialKeyword: string;

  @ApiProperty({
    description: '검색할 키워드 개수 (최대 100개)',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  searchCount: number;
}

export class KeywordMetricsResponseDto {
  @ApiProperty({
    description: '키워드',
    example: '가을제철음식',
  })
  keyword: string;

  @ApiProperty({
    description: 'PC 월간 검색수',
    example: 12000,
  })
  pcMonthlySearchVolume: number;

  @ApiProperty({
    description: '모바일 월간 검색수',
    example: 18000,
  })
  mobileMonthlySearchVolume: number;

  @ApiProperty({
    description: '총 월간 검색수',
    example: 30000,
  })
  totalMonthlySearchVolume: number;

  @ApiProperty({
    description: '문서수 (검색 결과 수)',
    example: 45000,
  })
  documentCount: number;

  @ApiProperty({
    description: '경쟁률 (0.0 ~ 1.0)',
    example: 0.65,
  })
  competitionRate: number;

  @ApiProperty({
    description: '경쟁도 등급',
    example: 'MEDIUM',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  })
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class BulkKeywordResearchResponseDto {
  @ApiProperty({
    description: '검색된 키워드 목록',
    type: [KeywordMetricsResponseDto],
  })
  keywords: KeywordMetricsResponseDto[];

  @ApiProperty({
    description: '총 검색된 키워드 수',
    example: 10,
  })
  totalSearched: number;

  @ApiProperty({
    description: '중복으로 건너뛴 키워드 수',
    example: 3,
  })
  skippedDuplicates: number;

  @ApiProperty({
    description: '검색 완료 시간',
    example: '2024-01-15T10:30:00.000Z',
  })
  completedAt: string;
}
