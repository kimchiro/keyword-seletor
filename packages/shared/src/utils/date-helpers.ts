/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 현재 날짜를 YYYY-MM 형식으로 반환
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * KST 시간대로 현재 시각을 ISO 문자열로 반환
 */
export function getCurrentKSTTime(): string {
  const now = new Date();
  const kstOffset = 9 * 60; // KST는 UTC+9
  const kstTime = new Date(now.getTime() + (kstOffset * 60 * 1000));
  return kstTime.toISOString();
}

/**
 * 지정된 일 수만큼 이전 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getDateBefore(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
