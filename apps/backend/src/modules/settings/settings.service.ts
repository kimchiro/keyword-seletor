import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateApiKeysDto } from './dto/update-api-keys.dto';
import { ApiKeysResponseDto } from './dto/api-keys-response.dto';
import axios from 'axios';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  private apiKeys: {
    clientId?: string;
    clientSecret?: string;
    customerId?: string;
  } = {};

  constructor(private configService: ConfigService) {
    // 시작시 환경 변수에서 API 키 로드
    this.loadApiKeysFromEnv();
  }

  private loadApiKeysFromEnv() {
    this.apiKeys = {
      clientId: this.configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: this.configService.get<string>('NAVER_CLIENT_SECRET'),
      customerId: this.configService.get<string>('NAVER_CUSTOMER_ID'),
    };
    
    this.logger.debug('환경 변수에서 API 키 로드 완료');
  }

  async getApiKeysStatus(): Promise<ApiKeysResponseDto> {
    const hasClientId = !!this.apiKeys.clientId;
    const hasClientSecret = !!this.apiKeys.clientSecret;
    const hasCustomerId = !!this.apiKeys.customerId;

    return {
      isConfigured: hasClientId && hasClientSecret && hasCustomerId,
      hasClientId,
      hasClientSecret,
      hasCustomerId,
      clientIdMasked: this.maskApiKey(this.apiKeys.clientId),
      clientSecretMasked: this.maskApiKey(this.apiKeys.clientSecret),
      customerIdMasked: this.maskApiKey(this.apiKeys.customerId),
    };
  }

  async updateApiKeys(updateApiKeysDto: UpdateApiKeysDto): Promise<ApiKeysResponseDto> {
    const { clientId, clientSecret, customerId } = updateApiKeysDto;

    // 메모리에 API 키 저장
    if (clientId) this.apiKeys.clientId = clientId;
    if (clientSecret) this.apiKeys.clientSecret = clientSecret;
    if (customerId) this.apiKeys.customerId = customerId;

    this.logger.log('API 키가 업데이트되었습니다');

    return this.getApiKeysStatus();
  }

  async disconnectApiKeys(): Promise<ApiKeysResponseDto> {
    // 메모리에서 API 키 삭제
    this.apiKeys = {
      clientId: undefined,
      clientSecret: undefined,
      customerId: undefined,
    };

    this.logger.log('API 키 연결이 끊어졌습니다');

    return this.getApiKeysStatus();
  }

  async testApiKeys(): Promise<{ isValid: boolean; message: string }> {
    if (!this.apiKeys.clientId || !this.apiKeys.clientSecret) {
      return {
        isValid: false,
        message: 'API 키가 설정되지 않았습니다.',
      };
    }

    try {
      // 네이버 검색 API로 간단한 테스트 요청
      const response = await axios.get('https://openapi.naver.com/v1/search/blog.json', {
        params: { query: '테스트', display: 1 },
        headers: {
          'X-Naver-Client-Id': this.apiKeys.clientId,
          'X-Naver-Client-Secret': this.apiKeys.clientSecret,
        },
        timeout: 5000,
      });

      if (response.status === 200) {
        return {
          isValid: true,
          message: 'API 키가 정상적으로 작동합니다.',
        };
      }

      return {
        isValid: false,
        message: 'API 응답이 올바르지 않습니다.',
      };
    } catch (error) {
      this.logger.error('API 키 테스트 실패:', error.message);
      
      if (error.response?.status === 401) {
        return {
          isValid: false,
          message: 'API 키가 유효하지 않습니다.',
        };
      }

      if (error.response?.status === 403) {
        return {
          isValid: false,
          message: 'API 사용 권한이 없습니다.',
        };
      }

      return {
        isValid: false,
        message: `API 테스트 실패: ${error.message}`,
      };
    }
  }

  // 다른 서비스에서 API 키를 가져올 수 있는 메서드
  getApiKeys() {
    return { ...this.apiKeys };
  }

  private maskApiKey(key?: string): string {
    if (!key) return '';
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  }
}
