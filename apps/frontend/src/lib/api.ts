import axios from 'axios';

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
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
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
};

export default apiClient;
