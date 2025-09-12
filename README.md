# 키워드 셀렉터 (Keyword Selector)

네이버 블로그 키워드 리서치 서비스 - MVP v0.1.0

## 📋 프로젝트 개요

D.I.A 관점의 검색 의도 충족 글쓰기를 위한 키워드 리서치 도구입니다.

### 🎯 주요 기능

- **검색량/경쟁도 분석**: 네이버 검색광고 API 기반
- **검색 트렌드**: 네이버 데이터랩 기반 트렌드 분석
- **연관 검색어**: 자동완성 및 연관검색어 수집
- **태그 후보**: 블로그 크롤링을 통한 태그 추천

### 🛠 기술 스택

- **모노레포**: Turbo + Workspaces
- **프론트엔드**: Next.js 14 + TypeScript + Emotion
- **백엔드**: NestJS + TypeORM + MySQL
- **캐시/큐**: Redis + BullMQ
- **크롤링**: Playwright
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

1. **사용자 요청** → 프론트엔드
2. **API 호출** → 백엔드 (레이트리미터 통과)
3. **캐시 확인** → Redis (히트 시 즉시 반환)
4. **큐 작업** → BullMQ (외부 API 호출 조율)
5. **데이터 수집** → 네이버 API + 크롤링
6. **결과 저장** → MySQL + Redis 캐시
7. **응답 반환** → 프론트엔드

### 캐시 전략

- **검색량**: 7~30일 TTL
- **트렌드**: 6~24시간 TTL  
- **연관어**: 24~72시간 TTL
- **태그**: 24~72시간 TTL

## 🔒 보안 및 준법

- 네이버 API 약관 준수
- robots.txt 준수
- User-Agent 명시
- 랜덤 지연 및 동시성 제한
- 비밀키 안전 저장
- PII 데이터 보호

## 📈 모니터링

- API 호출 로그
- 에러율 추적
- 캐시 히트율
- 큐 처리 상태
- 서킷브레이커 상태

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 \`LICENSE\` 파일을 참조하세요.

## 👨‍💻 개발자

**김동은** - 초기 작업 및 유지보수

---

**MVP v0.1.0** - 2024년 기준 초기 버전
