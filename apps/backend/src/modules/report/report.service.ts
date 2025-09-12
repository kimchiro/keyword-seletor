import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportService {
  async getReport(keyword: string) {
    // TODO: 리포트 로직 구현
    return {
      keyword,
      message: 'Report service implementation pending',
    };
  }
}
