'use client';

import { BulkKeywordResearchResponse } from '@/types/keyword';

export interface SearchHistoryItem {
  id: string;
  initialKeyword: string;
  searchCount: number;
  results: BulkKeywordResearchResponse;
  createdAt: string;
}

const SEARCH_HISTORY_KEY = 'keyword-search-history';

export const searchHistoryStorage = {
  // 검색 기록 저장
  saveSearchHistory: (item: Omit<SearchHistoryItem, 'id' | 'createdAt'>): void => {
    try {
      const existingHistory = searchHistoryStorage.getSearchHistory();
      const newItem: SearchHistoryItem = {
        ...item,
        id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      
      // 최신 항목을 맨 앞에 추가하고, 최대 50개까지만 보관
      const updatedHistory = [newItem, ...existingHistory].slice(0, 50);
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
    }
  },

  // 검색 기록 불러오기
  getSearchHistory: (): SearchHistoryItem[] => {
    try {
      const historyJson = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!historyJson) return [];
      
      const history = JSON.parse(historyJson) as SearchHistoryItem[];
      // 날짜순으로 정렬 (최신순)
      return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('검색 기록 불러오기 실패:', error);
      return [];
    }
  },

  // 특정 검색 기록 삭제
  deleteSearchHistory: (id: string): void => {
    try {
      const existingHistory = searchHistoryStorage.getSearchHistory();
      const updatedHistory = existingHistory.filter(item => item.id !== id);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('검색 기록 삭제 실패:', error);
    }
  },

  // 모든 검색 기록 삭제
  clearSearchHistory: (): void => {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('검색 기록 전체 삭제 실패:', error);
    }
  },

  // 검색 기록 개수 가져오기
  getSearchHistoryCount: (): number => {
    return searchHistoryStorage.getSearchHistory().length;
  },
};
