import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateApiKeysDto } from './dto/update-api-keys.dto';
import { ApiKeysResponseDto } from './dto/api-keys-response.dto';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('api-keys')
  @ApiOperation({
    summary: 'API 키 설정 상태 조회',
    description: '현재 설정된 네이버 API 키의 상태를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'API 키 설정 상태',
    type: ApiKeysResponseDto,
  })
  async getApiKeysStatus(): Promise<ApiKeysResponseDto> {
    return this.settingsService.getApiKeysStatus();
  }

  @Post('api-keys')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'API 키 설정 업데이트',
    description: '네이버 API 키를 업데이트합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'API 키 업데이트 성공',
    type: ApiKeysResponseDto,
  })
  async updateApiKeys(
    @Body() updateApiKeysDto: UpdateApiKeysDto,
  ): Promise<ApiKeysResponseDto> {
    return this.settingsService.updateApiKeys(updateApiKeysDto);
  }

  @Post('api-keys/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'API 키 연결 테스트',
    description: '설정된 네이버 API 키의 유효성을 테스트합니다.',
  })
  async testApiKeys(): Promise<{ isValid: boolean; message: string }> {
    return this.settingsService.testApiKeys();
  }

  @Post('api-keys/disconnect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'API 키 연결 끊기',
    description: '설정된 네이버 API 키를 삭제하여 연결을 끊습니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'API 키 연결 끊기 성공',
    type: ApiKeysResponseDto,
  })
  async disconnectApiKeys(): Promise<ApiKeysResponseDto> {
    return this.settingsService.disconnectApiKeys();
  }
}
