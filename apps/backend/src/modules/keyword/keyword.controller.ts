import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { KeywordService } from './keyword.service';
import { KeywordResearchDto } from './dto/keyword-research.dto';
import { KeywordAnalysisResponseDto } from './dto/keyword-analysis-response.dto';

@ApiTags('keywords')
@Controller('keywords')
@UseGuards(ThrottlerGuard)
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post('research')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '키워드 리서치 실행',
    description: '입력된 키워드에 대한 종합적인 분석을 수행합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '키워드 분석 결과',
    type: KeywordAnalysisResponseDto,
  })
  async researchKeyword(
    @Body() keywordResearchDto: KeywordResearchDto,
  ): Promise<KeywordAnalysisResponseDto> {
    return this.keywordService.researchKeyword(keywordResearchDto);
  }

  @Get('metrics')
  @ApiOperation({
    summary: '키워드 검색량 조회',
    description: '특정 키워드의 월별 검색량 데이터를 조회합니다.',
  })
  async getKeywordMetrics(@Query('keyword') keyword: string) {
    return this.keywordService.getKeywordMetrics(keyword);
  }

  @Get('trends')
  @ApiOperation({
    summary: '키워드 트렌드 조회',
    description: '특정 키워드의 검색 트렌드 데이터를 조회합니다.',
  })
  async getKeywordTrends(@Query('keyword') keyword: string) {
    return this.keywordService.getKeywordTrends(keyword);
  }

  @Get('related')
  @ApiOperation({
    summary: '연관 검색어 조회',
    description: '특정 키워드의 연관 검색어를 조회합니다.',
  })
  async getRelatedTerms(@Query('keyword') keyword: string) {
    return this.keywordService.getRelatedTerms(keyword);
  }

  @Get('tags')
  @ApiOperation({
    summary: '태그 후보 조회',
    description: '특정 키워드의 블로그 태그 후보를 조회합니다.',
  })
  async getTagSuggestions(@Query('keyword') keyword: string) {
    return this.keywordService.getTagSuggestions(keyword);
  }
}
