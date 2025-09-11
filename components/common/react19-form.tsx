'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormState {
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errors?: Record<string, string>;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface React19FormProps {
  className?: string;
  onSubmitAction?: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

// 모의 서버 액션 (실제로는 서버에서 실행)
async function submitFormAction(prevState: FormState, formData: FormData): Promise<FormState> {
  // 로딩 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data: ContactFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
  };

  // 유효성 검사
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = '이름을 입력해주세요.';
  }

  if (!data.email?.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }

  if (!data.message?.trim()) {
    errors.message = '메시지를 입력해주세요.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: '입력 내용을 확인해주세요.',
      status: 'error',
      errors,
    };
  }

  // 성공 시뮬레이션 (가끔 실패도 시뮬레이션)
  const isSuccess = Math.random() > 0.3;

  if (isSuccess) {
    return {
      message: `안녕하세요 ${data.name}님! 메시지가 성공적으로 전송되었습니다.`,
      status: 'success',
    };
  } else {
    return {
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
      status: 'error',
    };
  }
}

export default function React19Form({ className, onSubmitAction }: React19FormProps) {
  // React 19의 새로운 useActionState 훅 사용
  const [state, formAction, isPending] = useActionState(onSubmitAction || submitFormAction, {
    message: '',
    status: 'idle' as const,
  });

  return (
    <div className={cn('w-full max-w-md space-y-4 rounded-lg border p-6', className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">React 19 Form</h2>
        <p className="text-muted-foreground text-sm">useActionState와 Server Actions를 활용한 폼</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            name="name"
            placeholder="홍길동"
            disabled={isPending}
            className={state.errors?.name ? 'border-destructive' : ''}
          />
          {state.errors?.name && <p className="text-destructive text-sm">{state.errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@example.com"
            disabled={isPending}
            className={state.errors?.email ? 'border-destructive' : ''}
          />
          {state.errors?.email && <p className="text-destructive text-sm">{state.errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">메시지</Label>
          <textarea
            id="message"
            name="message"
            placeholder="메시지를 입력하세요..."
            disabled={isPending}
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              state.errors?.message ? 'border-destructive' : ''
            )}
          />
          {state.errors?.message && <p className="text-destructive text-sm">{state.errors.message}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? '전송 중...' : '전송'}
        </Button>
      </form>

      {/* 상태 메시지 */}
      {state.message && (
        <div
          className={cn(
            'rounded-md p-3 text-sm',
            state.status === 'success' && 'border border-green-200 bg-green-50 text-green-800',
            state.status === 'error' && 'border border-red-200 bg-red-50 text-red-800'
          )}
        >
          {state.message}
        </div>
      )}

      {/* React 19 특징 설명 */}
      <div className="text-muted-foreground space-y-1 text-xs">
        <p>
          <strong>React 19 새로운 기능:</strong>
        </p>
        <ul className="ml-2 list-inside list-disc space-y-1">
          <li>
            <code>useActionState</code>: 폼 상태 관리 (기존 useFormState 대체)
          </li>
          <li>
            <code>isPending</code>: 자동 로딩 상태 제공
          </li>
          <li>
            <code>form action</code>: Server Actions와 자연스런 통합
          </li>
          <li>향상된 에러 처리 및 상태 관리</li>
        </ul>
      </div>
    </div>
  );
}
