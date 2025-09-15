'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '@/lib/api';

interface ApiKeyStatus {
  isConnected: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useApiKeyStatus() {
  const [status, setStatus] = useState<ApiKeyStatus>({
    isConnected: false,
    hasClientId: false,
    hasClientSecret: false,
    isLoading: true,
    error: null,
  });

  const checkApiKeyStatus = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await settingsApi.getApiKeysStatus();
      
      setStatus({
        isConnected: response.isConfigured || false, // 백엔드에서는 isConfigured 필드를 사용
        hasClientId: response.hasClientId || false,
        hasClientSecret: response.hasClientSecret || false,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'API 키 상태 확인 실패';
      
      setStatus({
        isConnected: false,
        hasClientId: false,
        hasClientSecret: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, []); // 빈 의존성 배열로 함수가 안정적으로 유지됨

  useEffect(() => {
    // 초기 상태 확인
    checkApiKeyStatus();

    // 30초마다 상태 확인 (실시간 업데이트)
    const interval = setInterval(checkApiKeyStatus, 30000);

    return () => clearInterval(interval);
  }, [checkApiKeyStatus]);

  return {
    ...status,
    refetch: checkApiKeyStatus,
  };
}
