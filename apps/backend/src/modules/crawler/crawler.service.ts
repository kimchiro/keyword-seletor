import { Injectable } from '@nestjs/common';

@Injectable()
export class CrawlerService {
  async startCrawling(keyword: string) {
    // TODO: 크롤링 로직 구현
    return {
      keyword,
      status: 'started',
      message: 'Crawler service implementation pending',
    };
  }
}
