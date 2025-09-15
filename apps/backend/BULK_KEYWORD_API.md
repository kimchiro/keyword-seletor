# 키워드 무한반복 조회 API

## 개요
이 API는 초기 키워드로부터 연관 키워드를 자동으로 찾아 지정된 개수만큼 반복 조회하는 기능을 제공합니다. 중복 키워드는 자동으로 건너뛰며, 각 키워드의 PC/모바일 월간검색수, 총 월간검색수, 문서수, 경쟁률을 제공합니다.

## API 엔드포인트

### POST /keywords/bulk-research

#### 요청 본문 (Request Body)
```json
{
  "initialKeyword": "가을제철음식",
  "searchCount": 10
}
```

#### 파라미터 설명
- `initialKeyword` (string, 필수): 검색을 시작할 초기 키워드
- `searchCount` (number, 필수): 검색할 키워드 개수 (최소 1개, 최대 100개)

#### 응답 형식 (Response)
```json
{
  "keywords": [
    {
      "keyword": "가을제철음식",
      "pcMonthlySearchVolume": 4800,
      "mobileMonthlySearchVolume": 7200,
      "totalMonthlySearchVolume": 12000,
      "documentCount": 45000,
      "competitionRate": 0.65,
      "competitionLevel": "MEDIUM"
    },
    {
      "keyword": "가을 제철 음식 추천",
      "pcMonthlySearchVolume": 2400,
      "mobileMonthlySearchVolume": 3600,
      "totalMonthlySearchVolume": 6000,
      "documentCount": 28000,
      "competitionRate": 0.45,
      "competitionLevel": "MEDIUM"
    }
  ],
  "totalSearched": 10,
  "skippedDuplicates": 3,
  "completedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 응답 필드 설명
- `keywords`: 조회된 키워드 목록
  - `keyword`: 키워드명
  - `pcMonthlySearchVolume`: PC 월간 검색수
  - `mobileMonthlySearchVolume`: 모바일 월간 검색수
  - `totalMonthlySearchVolume`: 총 월간 검색수
  - `documentCount`: 문서수 (검색 결과 수)
  - `competitionRate`: 경쟁률 (0.0 ~ 1.0)
  - `competitionLevel`: 경쟁도 등급 (LOW, MEDIUM, HIGH)
- `totalSearched`: 총 검색된 키워드 수
- `skippedDuplicates`: 중복으로 건너뛴 키워드 수
- `completedAt`: 검색 완료 시간

## 사용 예시

### cURL 예시
```bash
curl -X POST http://localhost:3001/keywords/bulk-research \
  -H "Content-Type: application/json" \
  -d '{
    "initialKeyword": "가을제철음식",
    "searchCount": 5
  }'
```

### JavaScript/TypeScript 예시
```typescript
const response = await fetch('http://localhost:3001/keywords/bulk-research', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    initialKeyword: '가을제철음식',
    searchCount: 5
  })
});

const data = await response.json();
console.log('검색된 키워드:', data.keywords);
```

## 동작 방식

1. **초기 키워드 조회**: 사용자가 입력한 초기 키워드의 검색량과 메트릭을 조회합니다.

2. **연관 키워드 수집**: 네이버 자동완성 API를 통해 연관 키워드를 수집합니다.

3. **무한반복 조회**: 
   - 수집된 연관 키워드들을 큐에 추가
   - 큐에서 키워드를 하나씩 꺼내어 조회
   - 각 키워드 조회 시 새로운 연관 키워드를 큐에 추가
   - 목표 개수에 도달할 때까지 반복

4. **중복 제거**: 이미 조회한 키워드는 자동으로 건너뜁니다.

5. **API 호출 제한**: 과도한 API 호출을 방지하기 위해 각 요청 간 0.5초 간격을 둡니다.

## 주의사항

- 네이버 API 키가 설정되지 않은 경우 추정값을 사용합니다.
- 연관 키워드가 부족한 경우 목표 개수보다 적게 조회될 수 있습니다.
- 대량 조회 시 시간이 오래 걸릴 수 있습니다 (키워드당 약 0.5초).
- 최대 100개까지만 조회 가능합니다.

## 오류 처리

API 호출 중 오류가 발생하면 해당 키워드는 건너뛰고 다음 키워드를 조회합니다. 모든 키워드 조회가 실패하면 빈 배열을 반환합니다.
