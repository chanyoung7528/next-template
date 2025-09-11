import { Meta, StoryObj } from '@storybook/nextjs-vite';

import React19Form from '@/components/common/react19-form';

interface FormState {
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errors?: Record<string, string>;
}

// 모의 액션들
const mockActions = {
  success: async (prevState: FormState, formData: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      message: '성공적으로 전송되었습니다!',
      status: 'success' as const,
    };
  },

  error: async (prevState: FormState, formData: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      message: '전송 중 오류가 발생했습니다.',
      status: 'error' as const,
    };
  },

  validationError: async (prevState: FormState, formData: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    return {
      message: '입력 내용을 확인해주세요.',
      status: 'error' as const,
      errors: {
        name: !data.name ? '이름은 필수입니다.' : '',
        email: !data.email
          ? '이메일은 필수입니다.'
          : !/\S+@\S+\.\S+/.test(data.email)
            ? '올바른 이메일 형식이 아닙니다.'
            : '',
        message: !data.message ? '메시지는 필수입니다.' : '',
      },
    };
  },
};

const meta = {
  title: 'Components/React 19/Form',
  component: React19Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
React 19의 새로운 \`useActionState\` 훅을 활용한 폼 컴포넌트입니다.

## React 19의 주요 업데이트:

### 1. useActionState
- 기존 \`useFormState\`를 대체하는 새로운 훅
- 폼의 상태와 액션을 더 직관적으로 관리
- 자동 로딩 상태 제공 (\`isPending\`)

### 2. Server Actions 통합
- 폼의 \`action\` 속성과 자연스럽게 통합
- 클라이언트-서버 통신이 더욱 간단해짐

### 3. 향상된 에러 처리
- 상태 기반 에러 관리
- 필드별 에러 표시 지원

### 4. 성능 최적화
- 불필요한 리렌더링 최소화
- 자동 로딩 상태 관리
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
      description: '폼 제출 시 실행될 액션 함수',
      control: false,
    },
  },
} satisfies Meta<typeof React19Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 React 19 폼입니다. 실제 서버 액션을 시뮬레이션하며, 랜덤하게 성공/실패를 반환합니다.',
      },
      source: {
        code: `// React 19 useActionState 사용 예시
'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormState {
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errors?: Record<string, string>;
}

// 서버 액션 정의
async function submitFormAction(prevState: FormState, formData: FormData): Promise<FormState> {
  // 로딩 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  };

  // 유효성 검사
  const errors: Record<string, string> = {};
  if (!data.name?.trim()) errors.name = '이름을 입력해주세요.';
  if (!data.email?.trim()) errors.email = '이메일을 입력해주세요.';
  if (!data.message?.trim()) errors.message = '메시지를 입력해주세요.';

  if (Object.keys(errors).length > 0) {
    return { message: '입력 내용을 확인해주세요.', status: 'error', errors };
  }

  return {
    message: \`안녕하세요 \${data.name}님! 메시지가 성공적으로 전송되었습니다.\`,
    status: 'success',
  };
}

export default function React19Form() {
  // ✨ React 19의 새로운 useActionState 훅 사용
  const [state, formAction, isPending] = useActionState(submitFormAction, {
    message: '',
    status: 'idle' as const,
  });

  return (
    <form action={formAction} className="space-y-4">
      <Input
        name="name"
        placeholder="이름"
        disabled={isPending}
        className={state.errors?.name ? 'border-destructive' : ''}
      />
      {state.errors?.name && <p className="text-destructive text-sm">{state.errors.name}</p>}
      
      <Button type="submit" disabled={isPending}>
        {isPending ? '전송 중...' : '전송'}
      </Button>
      
      {state.message && (
        <div className={state.status === 'success' ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </div>
      )}
    </form>
  );
}`,
      },
    },
  },
};

export const AlwaysSuccess: Story = {
  args: {
    className: 'border-green-200',
    onSubmitAction: mockActions.success,
  },
  parameters: {
    docs: {
      description: {
        story: '항상 성공하는 폼입니다. 성공 상태의 UI를 확인할 수 있습니다.',
      },
    },
  },
};

export const AlwaysError: Story = {
  args: {
    className: 'border-red-200',
    onSubmitAction: mockActions.error,
  },
  parameters: {
    docs: {
      description: {
        story: '항상 에러를 반환하는 폼입니다. 에러 상태의 UI를 확인할 수 있습니다.',
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
        story: '유효성 검사 에러를 보여주는 폼입니다. 빈 값으로 제출하면 필드별 에러 메시지를 확인할 수 있습니다.',
      },
    },
  },
};

export const CustomStyled: Story = {
  args: {
    className: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 스타일이 적용된 폼입니다. className prop을 통해 스타일을 커스터마이징할 수 있습니다.',
      },
    },
  },
};

// 인터랙티브 테스트를 위한 스토리
export const Interactive: Story = {
  args: {
    className: 'border-purple-200',
  },
  parameters: {
    docs: {
      description: {
        story: `
인터랙티브 테스트용 폼입니다. 다양한 시나리오를 테스트해보세요:

1. **정상 제출**: 모든 필드를 올바르게 채우고 제출
2. **유효성 에러**: 일부 필드를 비우고 제출
3. **이메일 형식 에러**: 잘못된 이메일 형식으로 제출
4. **로딩 상태**: 제출 중 버튼과 필드가 비활성화되는 것 확인

React 19의 \`useActionState\`가 이 모든 상태를 자동으로 관리합니다!
        `,
      },
      source: {
        code: `// 실전 useActionState 패턴
'use client';

import { useActionState } from 'react';

// 📋 테스트 시나리오들
const testCases = [
  "정상 제출: 모든 필드 올바르게 입력",
  "유효성 에러: 필드 비우고 제출",
  "이메일 형식 에러: 'invalid-email' 입력",
  "로딩 상태: 제출 중 UI 비활성화 확인"
];

async function submitFormAction(prevState, formData) {
  // 실제 네트워크 요청 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };
  
  // 서버사이드 유효성 검사
  const errors = {};
  if (!data.name?.trim()) errors.name = '이름을 입력해주세요.';
  if (!data.email?.trim()) errors.email = '이메일을 입력해주세요.';
  else if (!/\\S+@\\S+\\.\\S+/.test(data.email)) errors.email = '올바른 이메일 형식이 아닙니다.';
  if (!data.message?.trim()) errors.message = '메시지를 입력해주세요.';
  
  if (Object.keys(errors).length > 0) {
    return { message: '입력 내용을 확인해주세요.', status: 'error', errors };
  }
  
  // 성공/실패 랜덤 시뮬레이션
  const isSuccess = Math.random() > 0.3;
  return isSuccess 
    ? { message: \`\${data.name}님, 메시지가 전송되었습니다!\`, status: 'success' }
    : { message: '서버 오류가 발생했습니다. 다시 시도해주세요.', status: 'error' };
}

export default function InteractiveForm() {
  // ✨ React 19 useActionState
  // [현재상태, 액션함수, 로딩여부] = useActionState(액션, 초기상태)
  const [state, formAction, isPending] = useActionState(submitFormAction, {
    message: '',
    status: 'idle',
  });

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">🧪 테스트 케이스</h3>
        <ul className="text-sm space-y-1">
          {testCases.map((test, i) => (
            <li key={i}>• {test}</li>
          ))}
        </ul>
      </div>

      <form action={formAction} className="space-y-4">
        <input
          name="name"
          placeholder="이름 (테스트: 비워두거나 정상 입력)"
          disabled={isPending}
          className={\`p-2 border rounded \${state.errors?.name ? 'border-red-500' : 'border-gray-300'}\`}
        />
        {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
        
        <input
          name="email"
          type="email"
          placeholder="이메일 (테스트: 'invalid-email' 입력해보기)"
          disabled={isPending}
          className={\`p-2 border rounded \${state.errors?.email ? 'border-red-500' : 'border-gray-300'}\`}
        />
        {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
        
        <button 
          type="submit" 
          disabled={isPending}
          className={\`w-full p-3 rounded font-semibold \${
            isPending 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }\`}
        >
          {isPending ? '전송 중... ⏳' : '전송하기 🚀'}
        </button>
      </form>
      
      {/* 실시간 상태 표시 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>상태:</span>
          <span className={\`font-semibold \${
            state.status === 'success' ? 'text-green-600' : 
            state.status === 'error' ? 'text-red-600' : 'text-gray-600'
          }\`}>
            {isPending ? '처리중 🔄' : state.status}
          </span>
        </div>
        
        {state.message && (
          <div className={\`p-3 rounded text-sm \${
            state.status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }\`}>
            {state.message}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>💡 useActionState 장점:</strong></p>
        <ul className="ml-4 space-y-1">
          <li>• 자동 로딩 상태 (isPending)</li>
          <li>• 서버 액션과 자연스러운 통합</li>
          <li>• Progressive Enhancement 지원</li>
          <li>• 에러 처리 간소화</li>
        </ul>
      </div>
    </div>
  );
}`,
      },
    },
  },
};
