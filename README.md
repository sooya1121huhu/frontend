# Perfume Frontend

React 기반의 향수 프론트엔드 애플리케이션입니다. 향수 목록 조회, 상세 정보 확인, 유사 향수 추천 기능을 제공합니다.

## 기술 스택

- React 19.1.0
- Material-UI (MUI) 7.2.0
- React Router DOM 6.x
- Axios 1.10.0
- Create React App

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```

## 배포

### S3 배포

이 프로젝트는 GitHub Actions를 통해 AWS S3에 자동 배포됩니다.

#### 1. S3 버킷 설정

```bash
# S3 버킷 생성 및 설정
./setup-s3-deployment.sh <BUCKET_NAME> <REGION>

# 예시
./setup-s3-deployment.sh perfume-frontend-bucket ap-northeast-2
```

#### 2. GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 시크릿을 설정하세요:

- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키
- `AWS_REGION`: AWS 리전 (예: ap-northeast-2)
- `S3_BUCKET_NAME`: S3 버킷 이름

#### 3. 배포 워크플로우

- `main` 브랜치에 푸시하면 자동으로 S3에 배포됩니다

### EC2 배포

기존 EC2 배포 워크플로우도 유지됩니다:

- `deploy.yml`: EC2 서버 배포
- `deploy-frontend.yml`: 프론트엔드 전용 EC2 배포

## 주요 기능

### 1. 향수 목록 페이지 (`/`)
- 향수 목록 조회 및 검색
- 계절/날씨별 필터링
- 보유 향수 등록 및 관리
- 향수 데이터베이스 추가

### 2. 향수 상세 페이지 (`/perfumes/:id`)
- 향수 상세 정보 조회
- 주요 노트, 계절/날씨 태그 표시
- 분석 이유 설명
- 유사 향수 추천 (2개 이상 공통 노트)
- 상품 링크 제공

## 프로젝트 구조

```
frontend/
├── public/                 # 정적 파일
├── src/                   # 소스 코드
│   ├── components/        # React 컴포넌트
│   │   └── PerfumeDetailPage.js  # 향수 상세 페이지
│   ├── pages/            # 페이지 컴포넌트
│   ├── services/         # API 서비스
│   └── utils/            # 유틸리티 함수
├── .github/workflows/    # GitHub Actions 워크플로우
│   ├── deploy-s3.yml     # S3 배포
│   ├── deploy.yml        # EC2 배포
│   └── deploy-frontend.yml # 프론트엔드 전용 배포
└── setup-s3-deployment.sh # S3 배포 설정 스크립트
```

## 개발 가이드

### 코드 스타일

- ESLint 설정을 따릅니다
- Prettier를 사용하여 코드 포맷팅을 유지합니다

### 테스트

```bash
# React 컴포넌트 테스트
npm test

# 테스트 커버리지 확인
npm test -- --coverage

# 특정 테스트 파일 실행
npm test -- --testPathPattern=ComponentName

# API 테스트 (향수 상세 페이지 API)
npm run test:api
```

### 빌드 최적화

- 프로덕션 빌드는 자동으로 최적화됩니다
- 코드 스플리팅이 적용됩니다
- 번들 크기 분석: `npm run build && npx serve -s build`

## 문제 해결

### 빌드 실패

1. Node.js 버전 확인 (18.x 이상 필요)
2. `node_modules` 삭제 후 `npm install` 재실행
3. 캐시 클리어: `npm run build -- --reset-cache`

### 배포 실패

1. GitHub Secrets 설정 확인
2. AWS 권한 확인
3. S3 버킷 정책 확인

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
