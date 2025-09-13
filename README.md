# 키워드 셀렉터 (Keyword Selector)

네이버 블로그 키워드 리서치 서비스 - MVP v0.1.0

## 📋 프로젝트 개요
D.I.A 관점의 검색 의도 충족 글쓰기를 위한 키워드 리서치 도구입니다.

### 🎯 주요 기능

- **검색량/경쟁도 분석**: 다중 소스 API 활용 (블로그, 뉴스, 카페, 쇼핑)
  - 종합 경쟁도 지수 계산 (0.0~1.0)
  - 상업적 경쟁 최소화로 SEO 최적화
  - HIGH/MEDIUM/LOW 등급 자동 분류
- **검색 트렌드**: 네이버 데이터랩 API 기반 실시간 트렌드
  - 최근 30일 일별 데이터
  - 시각화 가능한 JSON 형태 제공
- **연관 검색어**: 네이버 자동완성 API 실시간 연동
  - 실제 사용자 검색 패턴 반영
  - 관련도 점수 포함
  - 가짜 데이터 완전 배제
- **태그 후보**: 다중 소스 크롤링 기반 태그 추천
  - 블로그/뉴스/카페 통합 분석
  - 빈도 기반 우선순위 정렬
  - 카테고리별 분류 (주요/일반/기타)

### 🛠 기술 스택

- **모노레포**: Turbo + Workspaces
- **프론트엔드**: Next.js 14 + TypeScript + Emotion
- **백엔드**: NestJS + TypeORM + MySQL + Bull Queue
- **캐시/큐**: Redis + BullMQ (키워드 분석 작업 큐)
- **외부 API**: 네이버 검색 API, 데이터랩 API, 자동완성 API
- **크롤링**: Cheerio 기반 웹 스크래핑
- **컨테이너**: Docker + Docker Compose

## 🚀 시작하기

### 1. 저장소 클론

\`\`\`bash
git clone https://github.com/your-username/keyword-selector.git
cd keyword-selector
\`\`\`

### 2. 환경 변수 설정

\`\`\`bash
cp env.example .env.local
# .env.local 파일을 편집하여 실제 값으로 설정
\`\`\`

### 3. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 4. 개발 환경 실행

#### Docker Compose 사용 (권장)

\`\`\`bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
\`\`\`

#### 로컬 개발

\`\`\`bash
# MySQL, Redis 먼저 실행
docker-compose up -d mysql redis

# 개발 서버 실행
npm run dev
\`\`\`

### 5. 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001/api/v1
- **API 문서**: http://localhost:3001/api/docs

## 📁 프로젝트 구조

\`\`\`
keyword-selector/
├── apps/
│   ├── backend/          # NestJS 백엔드
│   └── frontend/         # Next.js 프론트엔드
├── packages/
│   └── shared/           # 공통 타입 및 유틸리티
├── docker/               # Docker 설정
├── .cursor/rules/        # 프로젝트 규칙
└── docs/                 # 문서
\`\`\`

## 🔧 개발 명령어

\`\`\`bash
# 전체 개발 서버 실행
npm run dev

# 전체 빌드
npm run build

# 전체 테스트
npm run test

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 타입 체크
npm run type-check

# 캐시 정리
npm run clean
\`\`\`

## 📊 아키텍처

### 데이터 플로우

1. **사용자 요청** → 프론트엔드 (키워드 입력)
2. **API 호출** → 백엔드 `/api/keyword/research`
3. **캐시 확인** → Redis (키워드별 1시간 캐시)
4. **실시간 데이터 수집** → 병렬 API 호출
   - 네이버 블로그/뉴스/카페/쇼핑 검색 API
   - 네이버 데이터랩 트렌드 API
   - 네이버 자동완성 API
   - 웹 크롤링 (태그 추출)
5. **데이터 분석** → 종합 경쟁도 지수 계산
6. **결과 저장** → MySQL + Redis 캐시
7. **응답 반환** → 구조화된 JSON 데이터

### 캐시 전략

- **전체 리포트**: 1시간 TTL (실시간 데이터 있는 경우)
- **처리중 상태**: 10분 TTL (데이터 수집 중)
- **데이터 신선도**: fresh(6시간 이내) / stale(24시간 이내) / processing(24시간 초과)
- **키워드별 개별 캐시**: 24시간 데이터 갱신 주기

## 🔒 보안 및 준법

- 네이버 API 약관 준수
- robots.txt 준수
- User-Agent 명시
- 랜덤 지연 및 동시성 제한
- 비밀키 안전 저장
- PII 데이터 보호

## 📈 구현 완료 기능

### ✅ 백엔드 API
- **키워드 리서치 엔드포인트**: `/api/keyword/research`
- **다중 소스 데이터 수집**: 병렬 API 호출로 성능 최적화
- **종합 경쟁도 분석**: 4개 소스 가중치 기반 계산
- **실시간 데이터 우선**: 가짜 데이터 완전 배제
- **캐싱 시스템**: Redis 기반 효율적 데이터 관리
- **에러 핸들링**: API 실패 시 안정적 처리

### ✅ 데이터 분석 알고리즘
- **검색량 계산**: `블로그×1.8 + 뉴스×2.2 + 카페×1.5 + 쇼핑×0.5`
- **경쟁도 지수**: `(블로그×35% + 뉴스×30% + 카페×25% + 쇼핑×10%) ÷ 50,000`
- **SEO 최적화**: 상업적 경쟁 최소화 (쇼핑 가중치 10%)
- **등급 분류**: HIGH(0.7+) / MEDIUM(0.3-0.7) / LOW(0.3-)

### 🔄 진행 중
- 프론트엔드 UI/UX 구현
- Docker 컨테이너화
- 성능 모니터링 시스템

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request


## 👨‍💻 개발자

**김동언** - 초기 작업 및 유지보수

---

**MVP v0.1.0** - 2025년 기준 초기 버전
