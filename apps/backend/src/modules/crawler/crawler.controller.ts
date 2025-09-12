import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';

@ApiTags('crawler')
@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('crawl')
  @ApiOperation({
    summary: '크롤링 작업 시작',
    description: '특정 키워드에 대한 크롤링 작업을 시작합니다.',
  })
  async startCrawling(@Body() body: { keyword: string }) {
    return this.crawlerService.startCrawling(body.keyword);
  }
}
