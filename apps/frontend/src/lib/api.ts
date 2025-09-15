import axios from 'axios';

// API 응답 타입 정의
interface ApiKeysStatusResponse {
  isConfigured: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasCustomerId: boolean;
  clientIdMasked: string;
  clientSecretMasked: string;
  customerIdMasked: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 오류:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 설정 관련 API
export const settingsApi = {
  getApiKeysStatus: async (): Promise<ApiKeysStatusResponse> => {
    const response = await apiClient.get('/settings/api-keys');
    return response.data;
  },

  updateApiKeys: async (data: { clientId?: string; clientSecret?: string; customerId?: string }) => {
    const response = await apiClient.post('/settings/api-keys', data);
    return response.data;
  },

  testApiKeys: async () => {
    const response = await apiClient.post('/settings/api-keys/test');
    return response.data;
  },

  disconnectApiKeys: async () => {
    const response = await apiClient.post('/settings/api-keys/disconnect');
    return response.data;
  },
};

// 키워드 관련 API
export const keywordApi = {
  researchKeyword: async (data: { keyword: string }) => {
    const response = await apiClient.post('/keywords/research', data);
    return response.data;
  },

  getKeywordMetrics: async (keyword: string) => {
    const response = await apiClient.get(`/keywords/metrics?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  getKeywordTrends: async (keyword: string) => {
    const response = await apiClient.get(`/keywords/trends?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  getRelatedTerms: async (keyword: string) => {
    const response = await apiClient.get(`/keywords/related?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  getTagSuggestions: async (keyword: string) => {
    const response = await apiClient.get(`/keywords/tags?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  bulkResearchKeywords: async (data: { initialKeyword: string; searchCount: number }) => {
    const response = await apiClient.post('/keywords/bulk-research', data);
    return response.data;
  },
};

export default apiClient;
