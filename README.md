# BO Template

인천공항 웹 애플리케이션 — 최신 기술 스택을 활용하여 구축된 사용자 친화적인 대시보드 및 기능형 웹 인터페이스입니다.

## 🧰 기술 스택

| 기술                | 설명                                                    |
| ------------------- | ------------------------------------------------------- |
| **Next.js 15**      | App Router 기반, 최신 React 기능 활용                   |
| **TypeScript**      | 정적 타입으로 안정적인 코드 작성                        |
| **Zustand**         | 가볍고 직관적인 글로벌 상태 관리                        |
| **shadcn/ui**       | 모던하고 재사용 가능한 UI 컴포넌트 모음                 |
| **react-hook-form** | 성능 최적화된 폼 상태 관리 라이브러리                   |
| **zod**             | 스키마 기반 타입 안전성과 유효성 검사를 위한 라이브러리 |
| **Jest**            | 유닛/통합 테스트                                        |
| **Vercel**          | 정적 호스팅 및 자동 배포 인프라                         |

---

## ⚙️ 설치 및 실행

### 1. 패키지 설치

```bash
pnpm install
```

2. 개발 서버 실행

```
pnpm dev
```

3. 테스트 실행

```
pnpm test
```

4. Storybook 실행

```
pnpm storybook
```

## ✅ 코드 스타일

### ESLint + Prettier로 정적 분석 및 자동 정렬

- TypeScript strict mode
- 폴더 단위의 관심사 분리 구조

## 🚀 배포

Vercel로 자동 배포되며, main 브랜치 푸시 시 배포가 트리거됩니다. </br>
배포 URL은 .env에 명시하거나 프로젝트 설정에서 확인 가능합니다.

## 📦 버전 관리

- Git 기반 브랜치 전략
- PR 단위로 기능/수정 사항 병합
- 필요 시 릴리즈 태그 생성

## 🧪 테스트 정책

- 컴포넌트 단위 테스트: Jest, @testing-library/react
- UI 스토리 문서화: Storybook 사용
- 통합 테스트는 추후 Playwright 등 도입 예정

# 프로젝트 디렉토리 구조

```plaintext
📁 루트 디렉토리
├── .env.example                # 환경 변수 예시 파일
├── .eslintrc.json              # ESLint 설정
├── .gitignore                  # Git 무시 파일 목록
├── .prettierrc.json            # Prettier 설정 (선택사항, package.json에 통합 가능)
├── next.config.mjs             # Next.js 설정 파일
├── package.json                # 프로젝트 의존성 및 스크립트
├── tsconfig.json               # TypeScript 설정
├── README.md                   # 프로젝트 설명 및 가이드

📁 public/                      # 정적 에셋 (이미지, 폰트 등)
├── fonts/
└── images/

📁 app/                         # Next.js App Router 핵심 디렉토리
├── (auth)/                    # 인증 관련 라우트 그룹 (예: 로그인, 회원가입)
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx             # 인증 페이지용 레이아웃
├── (main)/                    # 주요 애플리케이션 라우트 그룹
│   ├── dashboard/
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # 대시보드 특정 레이아웃
│   │   └── page.tsx
│   ├── layout.tsx             # 메인 애플리케이션 레이아웃
│   └── page.tsx               # 홈페이지 (루트 페이지)
├── api/                       # API Route Handlers
│   └── hello/
│       └── route.ts           # 예시 API 엔드포인트
├── global-error.tsx           # 전역 에러 처리 (프로덕션)
├── layout.tsx                 # 루트 레이아웃 (필수)
├── loading.tsx                # 루트 로딩 UI
├── not-found.tsx              # 404 페이지
└── template.tsx               # 루트 템플릿 (필요시)

📁 components/                 # 재사용 가능한 컴포넌트
├── ui/                        # 기본적인 UI 요소 (Button, Input, Card 등)
│   └── Button.tsx
├── common/                    # 여러 UI 요소를 조합한 공통 컴포넌트 (Navbar 등)
│   └── Navbar.tsx
└── page/                      # 도메인 종속 컴포넌트
    └── user/
        └── UserProfile.tsx

📁 contexts/                   # React Context API (전역 상태 관리)
└── ThemeContext.tsx

📁 hooks/                      # 커스텀 React Hooks
└── useDebounce.ts

📁 lib/                        # 유틸리티, 상수, 외부 라이브러리 설정
├── apiClient.ts              # API 클라이언트 (fetch/axios 등)
├── constants.ts              # 전역 상수
├── utils.ts                  # 일반 유틸리티 함수
└── schema.ts                 # 유효성 검사 스키마 (예: Zod)

📁 services/ (또는 lib/apiService/) # API 호출 추상화 로직
└── userService.ts            # getUser, updateUser 등

📁 store/                      # 전역 상태 관리 (Zustand, Redux 등)
├── userSlice.ts              # Redux Toolkit 예시
└── index.ts

📁 styles/                     # 전역 스타일, 테마 관련
├── globals.css               # 전역 CSS (Tailwind 포함)
└── theme.ts                  # 테마 정의 (CSS-in-JS 등)

📁 types/ (또는 interfaces/)  # 타입 정의
├── index.ts                  # 공통 타입
├── api.ts                    # API 관련 타입
└── entities.ts               # 주요 데이터 모델 타입

📁 tests/                      # 테스트 코드 (Jest, RTL 등)
├── __mocks__/
└── components/
    └── Button.test.tsx
```

## 📄 라이선스

해당 프로젝트는 MIT 라이선스를 따릅니다.
# next-template
# next-template
