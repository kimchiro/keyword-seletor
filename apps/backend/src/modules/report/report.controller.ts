import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportService } from './report.service';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':keyword')
  @ApiOperation({
    summary: '키워드 리포트 조회',
    description: '특정 키워드의 종합 리포트를 조회합니다.',
  })
  async getReport(@Param('keyword') keyword: string) {
    return this.reportService.getReport(keyword);
  }
}
