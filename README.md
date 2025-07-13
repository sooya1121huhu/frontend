# Perfume Frontend

React 기반의 향수 프론트엔드 애플리케이션입니다. 향수 목록 조회, 상세 정보 확인, 유사 향수 추천 기능을 제공합니다.

## 🆕 최신 업데이트 (v2.0)

### 향수 데이터베이스 구조 개선

향수 데이터베이스 구조가 대폭 개선되어 더 정확하고 상세한 향수 정보를 제공합니다:

#### 새로운 노트 구조
- **탑 노트 (Top Notes)**: 향수의 첫인상을 결정하는 휘발성 높은 노트
- **미들 노트 (Middle Notes)**: 향수의 핵심을 이루는 중간 톤 노트  
- **베이스 노트 (Base Notes)**: 향수의 지속성을 담당하는 저휘발성 노트
- **향 노트 (Fragrance Notes)**: 모든 노트의 통합 목록

#### 아코드 정보 추가
- 향수의 향 조합을 시각적으로 표현
- 각 아코드의 비율을 퍼센트로 표시
- 최대 5개 아코드까지 지원

#### 브랜드 테이블 구조 변경
- `brands` → `perfumes_brand` 테이블명 변경
- 향수 전용 브랜드 관리 시스템

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
- **새로운 노트 구조**: 탑/미들/베이스 노트 구분 표시
- **아코드 정보**: 향 조합의 시각적 표현
- 계절/날씨 태그 표시
- 분석 이유 설명
- 유사 향수 추천 (2개 이상 공통 노트)
- 상품 링크 제공

### 3. 향수 등록/수정 폼
- **새로운 노트 입력**: 탑/미들/베이스 노트 분리 입력
- **아코드 구성**: 최대 5개 아코드 이름 및 비율 설정
- 자동 fragrance_notes 생성
- 계절/날씨 태그 선택
- 분석 이유 입력

## 새로운 컴포넌트

### NoteDisplay 컴포넌트
향수의 노트 정보를 타입별로 구분하여 표시합니다.

```jsx
<NoteDisplay 
  perfume={perfume} 
  showTitle={true} 
  compact={false} 
/>
```

**Props:**
- `perfume`: 향수 데이터 객체
- `showTitle`: 노트 타입 제목 표시 여부
- `compact`: 컴팩트 모드 (작은 크기로 표시)

### AccordDisplay 컴포넌트
향수의 아코드 정보를 시각적으로 표시합니다.

```jsx
<AccordDisplay 
  perfume={perfume} 
  showTitle={true} 
  compact={false} 
/>
```

**Props:**
- `perfume`: 향수 데이터 객체
- `showTitle`: 아코드 제목 표시 여부
- `compact`: 컴팩트 모드

### PerfumeForm 컴포넌트
향수 등록 및 수정을 위한 통합 폼 컴포넌트입니다.

```jsx
<PerfumeForm
  open={dialogOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
  perfume={editPerfume} // 수정 시에만 전달
  brands={brands}
  loading={loading}
  error={error}
/>
```

## 프로젝트 구조

```
frontend/
├── public/                 # 정적 파일
├── src/                   # 소스 코드
│   ├── components/        # React 컴포넌트
│   │   ├── PerfumeDetailPage.js  # 향수 상세 페이지
│   │   ├── NoteDisplay.js        # 노트 표시 컴포넌트
│   │   ├── AccordDisplay.js      # 아코드 표시 컴포넌트
│   │   └── PerfumeForm.js        # 향수 등록/수정 폼
│   ├── pages/            # 페이지 컴포넌트
│   ├── services/         # API 서비스
│   └── utils/            # 유틸리티 함수
├── .github/workflows/    # GitHub Actions 워크플로우
│   ├── deploy-s3.yml     # S3 배포
│   ├── deploy.yml        # EC2 배포
│   └── deploy-frontend.yml # 프론트엔드 전용 배포
└── setup-s3-deployment.sh # S3 배포 설정 스크립트
```

## API 변경사항

### 향수 목록 조회 (GET /api/perfumes)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "brand_id": 1,
      "name": "Chanel N°5",
      "top_notes": ["알데하이드", "베르가못"],
      "middle_notes": ["이리스", "재스민"],
      "base_notes": ["베티버", "바닐라", "파츌리"],
      "fragrance_notes": ["알데하이드", "베르가못", "이리스", "재스민", "베티버", "바닐라", "파츌리"],
      "accord_1_name": "플로럴",
      "accord_1_width": 45.50,
      "accord_2_name": "우디",
      "accord_2_width": 30.25,
      "status": 1,
      "PerfumeBrand": {
        "id": 1,
        "name": "Chanel"
      }
    }
  ]
}
```

### 향수 등록/수정 (POST/PUT /api/perfumes)
```json
{
  "brand_id": 1,
  "name": "새로운 향수",
  "top_notes": ["베르가못", "핑크 페퍼"],
  "middle_notes": ["로즈", "재스민"],
  "base_notes": ["머스크", "바닐라"],
  "fragrance_notes": ["베르가못", "핑크 페퍼", "로즈", "재스민", "머스크", "바닐라"],
  "accord_1_name": "플로럴",
  "accord_1_width": 40.00,
  "accord_2_name": "스파이시",
  "accord_2_width": 25.00
}
```

### 브랜드 API 변경
- 기존: `GET /api/brands`
- 변경: `GET /api/perfumes-brands` (하위 호환성 유지)

## 하위 호환성

기존 데이터와의 호환성을 위해 다음 기능들이 유지됩니다:

1. **기존 notes 필드 지원**: 새로운 노트 구조가 없으면 기존 notes 필드 사용
2. **브랜드 API 폴백**: 새로운 브랜드 API 실패 시 기존 API 사용
3. **점진적 마이그레이션**: 기존 데이터는 그대로 유지되며 새로운 구조로 점진적 전환 가능

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

### 새로운 기능 관련 문제

1. **노트가 표시되지 않는 경우**: 기존 데이터는 `notes` 필드 사용, 새 데이터는 `top_notes`, `middle_notes`, `base_notes` 사용
2. **아코드 정보가 없는 경우**: 아코드 정보는 선택사항이므로 표시되지 않을 수 있음
3. **브랜드 정보 오류**: 새로운 브랜드 API 엔드포인트 확인

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
