import { Meta, StoryObj } from '@storybook/nextjs-vite';

import AsyncValidationComponent, { asyncValidationCode } from './forms/AsyncValidationComponent';
import ExperienceManagerComponent, { experienceManagerCode } from './forms/ExperienceManager';
import QuoteCalculatorComponent, { quoteCalculatorCode } from './forms/QuoteCalculatorComponent';
import WizardComponent from './forms/WizardComponent';

const meta = {
  title: 'React-hook-form',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
React Hook Form의 고급 패턴을 활용한 복잡한 폼 예제들입니다.

## 고급 기능들

### 1. useFieldArray - 동적 필드 관리
- 항목 추가/삭제 기능
- 최소/최대 개수 제한
- 드래그앤드롭 정렬 (선택사항)
- 중첩된 객체 배열 처리

### 2. 비동기 유효성 검사
- 실시간 서버 검증
- 디바운스 적용
- 로딩 상태 표시
- 에러 핸들링

### 3. 실시간 계산
- watch()를 활용한 실시간 업데이트
- 복잡한 비즈니스 로직 적용
- 시각적 피드백
- 퍼센티지 분석

### 4. 다단계 위자드
- 단계별 유효성 검사
- 조건부 스텝 건너뛰기
- 진행률 표시
- 네비게이션 제어

### 5. 복잡한 조건부 렌더링
- 다중 의존성 필드
- 중첩된 조건문
- 동적 스키마 검증

## 실제 비즈니스 시나리오
모든 예제는 실제 비즈니스에서 사용할 수 있는 패턴들로 구성되어 있습니다:
- 연락처 관리 시스템
- 이력서/포트폴리오 관리
- 견적 계산기
- 회사 설정 위자드
- 주문 관리 시스템
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

// 1. 경력 관리 시스템 (중첩 배열)
export const ExperienceManager: StoryObj = {
  name: '1. 경력 관리 시스템 (중첩 배열)',
  render: () => <ExperienceManagerComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '중첩된 배열 구조를 활용한 복잡한 경력 관리 시스템입니다. 경력 안에 성과 배열을 포함하고, 현재 근무 여부에 따른 조건부 렌더링을 구현했습니다.',
      },
      source: {
        code: experienceManagerCode,
      },
    },
  },
};

// 2. 비동기 유효성 검사
export const AsyncValidationExample: StoryObj = {
  name: '2. 비동기 유효성 검사',
  render: () => <AsyncValidationComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '실제 서버 검증을 시뮬레이션하는 비동기 유효성 검사 예제입니다. 디바운스, 로딩 상태, 에러 처리 등의 UX 패턴을 포함합니다.',
      },
      source: {
        code: asyncValidationCode,
      },
    },
  },
};

// 3. 실시간 견적 계산기
export const RealTimeQuoteCalculator: StoryObj = {
  name: '3. 실시간 견적 계산기',
  render: () => <QuoteCalculatorComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '복잡한 비즈니스 로직이 포함된 실시간 견적 계산기입니다. 서비스 추가, 할인 적용, 세금 계산, 추가 옵션 등을 실시간으로 반영합니다.',
      },
      source: {
        code: quoteCalculatorCode,
      },
    },
  },
};

// 4. 다단계 회사 설정 위자드
export const MultiStepWizard: StoryObj = {
  name: '4. 다단계 회사 설정 위자드',
  render: () => <WizardComponent />,
  parameters: {
    docs: {
      description: {
        story:
          '복잡한 다단계 설정 과정을 위자드 형태로 구현한 예제입니다. 각 단계별 유효성 검사와 진행률 표시, 네비게이션 기능을 포함합니다.',
      },
      source: {
        code: '',
      },
    },
  },
};
