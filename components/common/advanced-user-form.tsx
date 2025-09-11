'use client';

import { useActionState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  INTEREST_OPTIONS,
  userProfileSchema,
  type UserProfileFormData,
  type UserProfileResponse,
} from '@/lib/schema/user-profile';
import { cn } from '@/lib/utils';

interface AdvancedUserFormProps {
  className?: string;
  onSubmitAction?: (prevState: UserProfileResponse, formData: FormData) => Promise<UserProfileResponse>;
}

// 모의 서버 액션
async function submitUserProfileAction(
  prevState: UserProfileResponse,
  formData: FormData
): Promise<UserProfileResponse> {
  // 로딩 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // FormData에서 데이터 추출
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

    // Zod로 서버사이드 유효성 검사
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

    // 이메일 중복 체크 시뮬레이션
    if (result.data.email === 'test@example.com') {
      return {
        success: false,
        message: '이미 사용 중인 이메일입니다.',
        errors: {
          email: '이미 사용 중인 이메일입니다.',
        },
      };
    }

    // 서버 에러 시뮬레이션
    if (Math.random() < 0.2) {
      throw new Error('서버 내부 오류가 발생했습니다.');
    }

    return {
      success: true,
      message: `${result.data.firstName} ${result.data.lastName}님, 가입이 완료되었습니다!`,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

export default function AdvancedUserForm({ className, onSubmitAction }: AdvancedUserFormProps) {
  // React Hook Form 설정
  const {
    handleSubmit,
    control,
    formState: { errors: formErrors, isValid, isDirty },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: '길동',
      lastName: '홍',
      email: 'hong.gildong@example.com',
      phone: '010-1234-5678',
      age: 28,
      bio: '안녕하세요! 프론트엔드 개발자로 일하고 있습니다. React와 TypeScript를 주로 사용하며, 사용자 경험을 개선하는 일에 관심이 많습니다.',
      interests: ['technology', 'books', 'travel'],
      newsletter: true,
      terms: true,
    },
    mode: 'onChange', // 실시간 유효성 검사
  });

  // useController for individual fields
  const firstNameController = useController({
    name: 'firstName',
    control,
  });

  const lastNameController = useController({
    name: 'lastName',
    control,
  });

  const emailController = useController({
    name: 'email',
    control,
  });

  const phoneController = useController({
    name: 'phone',
    control,
  });

  const ageController = useController({
    name: 'age',
    control,
  });

  const bioController = useController({
    name: 'bio',
    control,
  });

  const interestsController = useController({
    name: 'interests',
    control,
  });

  const newsletterController = useController({
    name: 'newsletter',
    control,
  });

  const termsController = useController({
    name: 'terms',
    control,
  });

  // useActionState for server actions
  const [state, formAction, isPending] = useActionState(onSubmitAction || submitUserProfileAction, {
    success: false,
    message: '',
  });

  // 관심사 체크박스 핸들러
  const handleInterestChange = (interest: string, checked: boolean) => {
    const currentInterests = interestsController.field.value || [];
    let newInterests: string[];

    if (checked) {
      newInterests = [...currentInterests, interest];
    } else {
      newInterests = currentInterests.filter((i) => i !== interest);
    }

    interestsController.field.onChange(newInterests);
  };

  // React Hook Form의 handleSubmit과 formAction 연결
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    // 데이터를 FormData로 변환
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'interests') {
        (value as string[]).forEach((interest) => {
          formData.append('interests', interest);
        });
      } else if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // formAction 호출
    formAction(formData);
  });

  // 서버 에러와 클라이언트 에러 통합
  const getFieldError = (fieldName: keyof UserProfileFormData) => {
    // 클라이언트 유효성 검사 에러 우선
    if (formErrors[fieldName]) {
      return formErrors[fieldName]?.message;
    }
    // 서버 에러
    if (state.errors && state.errors[fieldName]) {
      return state.errors[fieldName];
    }
    return undefined;
  };

  return (
    <div className={cn('w-full max-w-2xl space-y-6 rounded-lg border p-6', className)}>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">고급 사용자 등록</h2>
        <p className="text-muted-foreground">React Hook Form + useActionState + Zod 조합</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 이름 섹션 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">이름 *</Label>
            <Input
              id="firstName"
              value={firstNameController.field.value}
              onChange={firstNameController.field.onChange}
              onBlur={firstNameController.field.onBlur}
              name={firstNameController.field.name}
              placeholder="길동"
              disabled={isPending}
              className={getFieldError('firstName') ? 'border-destructive' : ''}
            />
            {getFieldError('firstName') && <p className="text-destructive text-sm">{getFieldError('firstName')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">성 *</Label>
            <Input
              id="lastName"
              value={lastNameController.field.value}
              onChange={lastNameController.field.onChange}
              onBlur={lastNameController.field.onBlur}
              name={lastNameController.field.name}
              placeholder="홍"
              disabled={isPending}
              className={getFieldError('lastName') ? 'border-destructive' : ''}
            />
            {getFieldError('lastName') && <p className="text-destructive text-sm">{getFieldError('lastName')}</p>}
          </div>
        </div>

        {/* 연락처 섹션 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              type="email"
              value={emailController.field.value}
              onChange={emailController.field.onChange}
              onBlur={emailController.field.onBlur}
              name={emailController.field.name}
              placeholder="example@example.com"
              disabled={isPending}
              className={getFieldError('email') ? 'border-destructive' : ''}
            />
            {getFieldError('email') && <p className="text-destructive text-sm">{getFieldError('email')}</p>}
            <p className="text-muted-foreground text-xs">💡 test@example.com은 중복 테스트용입니다</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호 *</Label>
            <Input
              id="phone"
              value={phoneController.field.value}
              onChange={phoneController.field.onChange}
              onBlur={phoneController.field.onBlur}
              name={phoneController.field.name}
              placeholder="010-1234-5678"
              disabled={isPending}
              className={getFieldError('phone') ? 'border-destructive' : ''}
            />
            {getFieldError('phone') && <p className="text-destructive text-sm">{getFieldError('phone')}</p>}
          </div>
        </div>

        {/* 나이 */}
        <div className="space-y-2">
          <Label htmlFor="age">나이 *</Label>
          <Input
            id="age"
            type="number"
            value={ageController.field.value.toString()}
            onChange={(e) => ageController.field.onChange(parseInt(e.target.value) || 0)}
            onBlur={ageController.field.onBlur}
            name={ageController.field.name}
            placeholder="25"
            disabled={isPending}
            className={getFieldError('age') ? 'border-destructive' : ''}
            min="14"
            max="100"
          />
          {getFieldError('age') && <p className="text-destructive text-sm">{getFieldError('age')}</p>}
        </div>

        {/* 자기소개 */}
        <div className="space-y-2">
          <Label htmlFor="bio">자기소개</Label>
          <textarea
            id="bio"
            value={bioController.field.value || ''}
            onChange={bioController.field.onChange}
            onBlur={bioController.field.onBlur}
            name={bioController.field.name}
            placeholder="자신을 간단히 소개해주세요..."
            disabled={isPending}
            rows={4}
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              getFieldError('bio') ? 'border-destructive' : ''
            )}
          />
          {getFieldError('bio') && <p className="text-destructive text-sm">{getFieldError('bio')}</p>}
        </div>

        {/* 관심사 */}
        <div className="space-y-3">
          <Label>관심사 * (1-5개 선택)</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {INTEREST_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`interest-${option.value}`}
                  checked={interestsController.field.value?.includes(option.value) || false}
                  onCheckedChange={(checked) => handleInterestChange(option.value, checked as boolean)}
                  disabled={isPending}
                />
                <Label htmlFor={`interest-${option.value}`} className="text-sm font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {getFieldError('interests') && <p className="text-destructive text-sm">{getFieldError('interests')}</p>}
        </div>

        {/* 체크박스 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={newsletterController.field.value}
              onCheckedChange={newsletterController.field.onChange}
              disabled={isPending}
            />
            <Label htmlFor="newsletter" className="text-sm">
              뉴스레터 구독 (선택)
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsController.field.value}
              onCheckedChange={termsController.field.onChange}
              disabled={isPending}
              className={getFieldError('terms') ? 'border-destructive' : ''}
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm">
                이용약관에 동의합니다 *
              </Label>
              {getFieldError('terms') && <p className="text-destructive text-sm">{getFieldError('terms')}</p>}
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button type="submit" disabled={isPending || !isDirty || !isValid} className="w-full">
          {isPending ? '가입 처리 중...' : '가입하기'}
        </Button>
      </form>

      {/* 상태 메시지 */}
      {state.message && (
        <div
          className={cn(
            'rounded-md p-4 text-sm',
            state.success
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          )}
        >
          <p className="font-medium">{state.message}</p>
          {state.success && state.data && (
            <div className="mt-2 text-xs">
              <p>선택한 관심사: {state.data.interests.join(', ')}</p>
              <p>뉴스레터 구독: {state.data.newsletter ? '예' : '아니요'}</p>
            </div>
          )}
        </div>
      )}

      {/* 실시간 유효성 검사 상태 */}
      <div className="text-muted-foreground space-y-1 text-xs">
        <p>
          <strong>실시간 검증 상태:</strong>
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <p>폼 변경됨: {isDirty ? '✅' : '❌'}</p>
          <p>유효성 검사: {isValid ? '✅' : '❌'}</p>
          <p>서버 처리: {isPending ? '🔄' : '✅'}</p>
          <p>제출 가능: {!isPending && isDirty && isValid ? '✅' : '❌'}</p>
        </div>
      </div>

      {/* 기술 스택 설명 */}
      <div className="text-muted-foreground space-y-1 text-xs">
        <p>
          <strong>사용된 기술:</strong>
        </p>
        <ul className="ml-2 list-inside list-disc space-y-1">
          <li>
            <code>React Hook Form</code>: 클라이언트 폼 상태 관리
          </li>
          <li>
            <code>useActionState</code>: React 19 서버 액션 처리
          </li>
          <li>
            <code>Zod</code>: 타입 안전한 스키마 유효성 검사
          </li>
          <li>
            <code>@hookform/resolvers/zod</code>: React Hook Form + Zod 통합
          </li>
          <li>실시간 유효성 검사 + 서버사이드 검증</li>
        </ul>
      </div>
    </div>
  );
}
