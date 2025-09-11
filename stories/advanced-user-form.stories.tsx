import { Meta, StoryObj } from '@storybook/nextjs-vite';

import AdvancedUserForm from '@/components/common/advanced-user-form';
import { userProfileSchema, type UserProfileFormData, type UserProfileResponse } from '@/lib/schema/user-profile';

// 다양한 모의 액션들
const mockActions = {
  // 항상 성공
  alwaysSuccess: async (prevState: UserProfileResponse, formData: FormData): Promise<UserProfileResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      age: parseInt(formData.get('age') as string) || 0,
      bio: (formData.get('bio') as string) || undefined,
      interests: formData.getAll('interests') as string[],
      newsletter: formData.get('newsletter') === 'true',
      terms: formData.get('terms') === 'true',
    };

    return {
      success: true,
      message: `${data.firstName} ${data.lastName}님, 가입이 완료되었습니다! 🎉`,
      data: data as UserProfileFormData,
    };
  },

  // 서버 에러
  serverError: async (): Promise<UserProfileResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: false,
      message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  },

  // 유효성 검사 에러 (서버사이드)
  validationError: async (prevState: UserProfileResponse, formData: FormData): Promise<UserProfileResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: false,
      message: '입력 내용을 다시 확인해주세요.',
      errors: {
        firstName: '이름이 너무 짧습니다.',
        email: '이미 사용 중인 이메일입니다.',
        age: '나이 정보가 올바르지 않습니다.',
        terms: '이용약관에 동의해주세요.',
      },
    };
  },

  // 이메일 중복 체크
  duplicateEmail: async (prevState: UserProfileResponse, formData: FormData): Promise<UserProfileResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const email = formData.get('email') as string;

    if (email === 'admin@example.com' || email === 'test@example.com') {
      return {
        success: false,
        message: '이미 사용 중인 이메일입니다.',
        errors: {
          email: '이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.',
        },
      };
    }

    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      age: parseInt(formData.get('age') as string) || 0,
      bio: (formData.get('bio') as string) || undefined,
      interests: formData.getAll('interests') as string[],
      newsletter: formData.get('newsletter') === 'true',
      terms: formData.get('terms') === 'true',
    };

    return {
      success: true,
      message: `${data.firstName} ${data.lastName}님, 환영합니다!`,
      data: data as UserProfileFormData,
    };
  },

  // 실제 유효성 검사 (Zod)
  realValidation: async (prevState: UserProfileResponse, formData: FormData): Promise<UserProfileResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      age: parseInt(formData.get('age') as string) || 0,
      bio: (formData.get('bio') as string) || undefined,
      interests: formData.getAll('interests') as string[],
      newsletter: formData.get('newsletter') === 'true',
      terms: formData.get('terms') === 'true',
    };

    // 실제 Zod 검증
    const result = userProfileSchema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });

      return {
        success: false,
        message: '서버에서 유효성 검사를 실패했습니다.',
        errors,
      };
    }

    return {
      success: true,
      message: `완벽합니다! ${result.data.firstName} ${result.data.lastName}님의 계정이 생성되었습니다.`,
      data: result.data,
    };
  },
};

const meta = {
  title: 'Components/React 19/Advanced User Form',
  component: AdvancedUserForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
React Hook Form + useActionState + Zod를 조합한 고급 사용자 등록 폼입니다.

## 🚀 핵심 기능

### 클라이언트사이드 (React Hook Form + Zod)
- **실시간 유효성 검사**: 입력 중 즉시 검증
- **타입 안전성**: TypeScript + Zod 스키마로 완벽한 타입 추론
- **최적화된 렌더링**: 필요한 부분만 리렌더링
- **접근성**: 완벽한 폼 접근성 지원

### 서버사이드 (useActionState)
- **Server Actions**: React 19의 새로운 서버 액션 패러다임
- **Progressive Enhancement**: JavaScript 없이도 동작
- **자동 로딩 상태**: isPending으로 자동 로딩 관리
- **에러 처리**: 클라이언트/서버 에러 통합 관리

### 유효성 검사 (Zod)
- **이중 검증**: 클라이언트 + 서버 모두에서 검증
- **런타임 안전성**: Zod로 런타임 타입 검사
- **커스텀 규칙**: 복잡한 비즈니스 로직 검증
- **에러 메시지**: 사용자 친화적 메시지

## 🎯 실제 프로덕션 패턴

이 컴포넌트는 실제 프로덕션에서 사용되는 패턴들을 구현합니다:

- **폼 상태 관리**: React Hook Form의 효율적인 상태 관리
- **서버 통신**: useActionState로 간단하고 안전한 서버 통신
- **타입 안전성**: 전체 데이터 플로우에서 타입 안전성 보장
- **UX 최적화**: 실시간 피드백과 명확한 상태 표시
- **접근성**: 스크린 리더와 키보드 네비게이션 지원

## 📋 테스트 시나리오

1. **정상 등록**: 모든 필드를 올바르게 입력
2. **유효성 에러**: 필수 필드 누락 또는 형식 오류
3. **서버 에러**: 네트워크 또는 서버 오류
4. **중복 체크**: 이메일 중복 검사
5. **실시간 검증**: 입력 중 실시간 피드백
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '컴포넌트에 적용할 CSS 클래스',
    },
    onSubmitAction: {
      description: '폼 제출 시 실행될 서버 액션 함수',
      control: false,
    },
  },
} satisfies Meta<typeof AdvancedUserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: `
기본 고급 사용자 등록 폼입니다.

**테스트 가이드:**
1. 모든 필드를 차례대로 입력해보세요
2. 실시간 유효성 검사를 확인하세요
3. 관심사를 1-5개 선택해보세요
4. 이용약관 동의는 필수입니다

**특별한 테스트 케이스:**
- 이메일에 \`test@example.com\` 입력 시 중복 에러 시뮬레이션
- 약 20% 확률로 서버 에러 발생
        `,
      },
      source: {
        code: `// React Hook Form + useActionState + Zod 조합 예시
'use client';

import { useActionState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ✨ Zod 스키마 정의
const userProfileSchema = z.object({
  firstName: z.string().min(2, '이름은 최소 2글자 이상').max(20, '이름은 최대 20글자'),
  lastName: z.string().min(1, '성은 필수입니다').max(20, '성은 최대 20글자'),
  email: z.string().min(1, '이메일은 필수입니다').email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().regex(/^010-\\d{4}-\\d{4}$/, '전화번호 형식: 010-1234-5678'),
  age: z.number().min(14, '14세 이상').max(100, '100세 이하'),
  interests: z.array(z.string()).min(1, '최소 1개 선택').max(5, '최대 5개 선택'),
  terms: z.boolean().refine(val => val === true, '이용약관에 동의해주세요'),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// 서버 액션 정의
async function submitUserProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    age: parseInt(formData.get('age') as string) || 0,
    interests: formData.getAll('interests') as string[],
    terms: formData.get('terms') === 'true',
  };

  // ✨ Zod로 서버사이드 유효성 검사
  const result = userProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      errors,
    };
  }

  return {
    success: true,
    message: \`\${result.data.firstName} \${result.data.lastName}님, 가입이 완료되었습니다!\`,
  };
}

export default function AdvancedUserForm() {
  // ✨ React Hook Form 설정 (Zod resolver와 함께)
  const { handleSubmit, control, formState: { errors, isValid, isDirty } } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: 14,
      interests: [],
      terms: false,
    },
    mode: 'onChange', // 실시간 유효성 검사
  });

  // ✨ useController로 각 필드 제어
  const firstNameController = useController({ name: 'firstName', control });
  const termsController = useController({ name: 'terms', control });

  // ✨ React 19 useActionState
  const [state, formAction, isPending] = useActionState(submitUserProfileAction, {
    success: false,
    message: '',
  });

  // React Hook Form과 formAction 연결
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'interests') {
        (value as string[]).forEach((interest) => formData.append('interests', interest));
      } else {
        formData.append(key, value.toString());
      }
    });
    formAction(formData);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        value={firstNameController.field.value}
        onChange={firstNameController.field.onChange}
        placeholder="이름"
        disabled={isPending}
      />
      {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
      
      <button type="submit" disabled={isPending || !isDirty || !isValid}>
        {isPending ? '가입 처리 중...' : '가입하기'}
      </button>
      
      {state.message && (
        <div className={state.success ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </div>
      )}
    </form>
  );
}

/* 
핵심 특징:
- useController: 각 필드의 세밀한 제어와 최적화된 렌더링
- useActionState: React 19 서버 액션과 자동 로딩 상태
- Zod: 클라이언트/서버 양쪽에서 타입 안전한 검증
- 실시간 유효성 검사: 입력 중 즉시 피드백
- Progressive Enhancement: JavaScript 없이도 동작
*/`,
      },
    },
  },
};

export const AlwaysSuccess: Story = {
  args: {
    className: 'border-green-200',
    onSubmitAction: mockActions.alwaysSuccess,
  },
  parameters: {
    docs: {
      description: {
        story: `
항상 성공하는 폼입니다. 

**용도:**
- 성공 플로우 테스트
- UI/UX 검증
- 성공 메시지 확인

모든 유효한 입력에 대해 성공 응답을 반환합니다.
        `,
      },
    },
  },
};

export const ServerError: Story = {
  args: {
    className: 'border-red-200',
    onSubmitAction: mockActions.serverError,
  },
  parameters: {
    docs: {
      description: {
        story: `
서버 에러를 시뮬레이션하는 폼입니다.

**테스트 목적:**
- 네트워크 오류 상황 테스트
- 에러 메시지 표시 확인
- 사용자 경험 검증

어떤 데이터를 입력해도 서버 에러가 발생합니다.
        `,
      },
    },
  },
};

export const ValidationErrors: Story = {
  args: {
    className: 'border-orange-200',
    onSubmitAction: mockActions.validationError,
  },
  parameters: {
    docs: {
      description: {
        story: `
서버사이드 유효성 검사 에러를 보여주는 폼입니다.

**에러 시나리오:**
- 이름이 너무 짧음
- 이메일 중복
- 나이 정보 오류
- 이용약관 미동의

클라이언트와 서버 에러가 어떻게 통합되는지 확인할 수 있습니다.
        `,
      },
    },
  },
};

export const EmailDuplicateCheck: Story = {
  args: {
    className: 'border-yellow-200',
    onSubmitAction: mockActions.duplicateEmail,
  },
  parameters: {
    docs: {
      description: {
        story: `
이메일 중복 검사 기능을 테스트하는 폼입니다.

**중복 테스트 이메일:**
- \`admin@example.com\`
- \`test@example.com\`

위 이메일들은 "이미 사용 중"으로 처리되며, 
다른 이메일은 정상 등록됩니다.
        `,
      },
    },
  },
};

export const RealZodValidation: Story = {
  args: {
    className: 'border-blue-200',
    onSubmitAction: mockActions.realValidation,
  },
  parameters: {
    docs: {
      description: {
        story: `
실제 Zod 스키마 검증을 사용하는 폼입니다.

**검증 규칙:**
- 이름/성: 한글, 영문만 (2-20글자)
- 이메일: 올바른 이메일 형식
- 전화번호: 010-####-#### 형식
- 나이: 14-100세
- 관심사: 1-5개 선택
- 자기소개: 최대 500글자
- 이용약관: 필수 동의

서버에서 실제 Zod 스키마로 검증하므로 정확한 검증 로직을 테스트할 수 있습니다.
        `,
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    className: 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50',
  },
  parameters: {
    docs: {
      description: {
        story: `
완전한 인터랙티브 데모 폼입니다.

## 🎮 테스트 시나리오

### 1. 실시간 유효성 검사
- 각 필드에 올바르지 않은 값을 입력해보세요
- 실시간으로 에러 메시지가 표시되는지 확인하세요
- 우측 하단의 "실시간 검증 상태"를 모니터링하세요

### 2. 서버 통신 테스트  
- \`test@example.com\` → 이메일 중복 에러
- 일반 이메일 → 20% 확률로 서버 에러, 80% 성공

### 3. 복잡한 필드 테스트
- 관심사: 1개 미만 또는 5개 초과 선택
- 전화번호: 올바르지 않은 형식 입력
- 나이: 14세 미만 또는 100세 초과

### 4. React 19 + Modern Stack 경험
- **useActionState**: 로딩 상태 자동 관리
- **React Hook Form**: 효율적인 폼 상태 관리  
- **Zod**: 타입 안전한 검증
- **Progressive Enhancement**: JS 없이도 동작

이 조합은 현재 React 생태계에서 가장 권장되는 폼 처리 패턴입니다! 🚀
        `,
      },
    },
  },
};
