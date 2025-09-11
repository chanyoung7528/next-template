'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import {
  ControlledCheckbox,
  ControlledCheckboxGroup,
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from './index';

// 폼 스키마 정의
const userRegistrationSchema = z.object({
  // 기본 정보
  name: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50자 이하로 입력해주세요.'),

  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),

  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '전화번호 형식: 010-1234-5678'),

  age: z.number().min(14, '14세 이상만 가입 가능합니다.').max(120, '올바른 나이를 입력해주세요.'),

  // 선택 필드
  country: z.string().min(1, '국가를 선택해주세요.'),

  occupation: z.string().optional(),

  // 텍스트 영역
  bio: z.string().max(500, '자기소개는 500자 이하로 입력해주세요.').optional(),

  // 체크박스
  agreeTerms: z.boolean().refine((val) => val === true, '이용약관에 동의해주세요.'),

  agreeMarketing: z.boolean().default(false),

  // 다중 선택
  interests: z.array(z.string()).min(1, '최소 1개의 관심사를 선택해주세요.').max(3, '최대 3개까지 선택 가능합니다.'),

  skills: z.array(z.string()).optional(),
});

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

const countryOptions = [
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
  { value: 'JP', label: '일본' },
  { value: 'CN', label: '중국' },
  { value: 'UK', label: '영국' },
];

const occupationOptions = [
  { value: 'student', label: '학생' },
  { value: 'employee', label: '직장인' },
  { value: 'freelancer', label: '프리랜서' },
  { value: 'entrepreneur', label: '사업가' },
  { value: 'retired', label: '은퇴자' },
  { value: 'other', label: '기타' },
];

const interestOptions = [
  { value: 'technology', label: '기술' },
  { value: 'design', label: '디자인' },
  { value: 'business', label: '비즈니스' },
  { value: 'art', label: '예술' },
  { value: 'music', label: '음악' },
  { value: 'sports', label: '스포츠' },
  { value: 'travel', label: '여행' },
  { value: 'food', label: '음식' },
];

const skillOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'design', label: '디자인' },
  { value: 'marketing', label: '마케팅' },
];

interface AdvancedFormProps {
  onSubmit?: (data: UserRegistrationForm) => void;
  loading?: boolean;
  className?: string;
}

export function AdvancedForm({ onSubmit, loading = false, className }: AdvancedFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema) as Resolver<UserRegistrationForm>,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      age: 18,
      country: '',
      occupation: '',
      bio: '',
      agreeTerms: false,
      agreeMarketing: false,
      interests: [],
      skills: [],
    },
    mode: 'onChange',
  });

  const handleFormSubmit = (data: UserRegistrationForm) => {
    console.log('폼 데이터:', data);
    onSubmit?.(data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>사용자 등록</CardTitle>
        <CardDescription>useController 훅을 활용한 고급 폼 예제입니다.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">기본 정보</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledInput name="name" control={control} label="이름" placeholder="홍길동" required />

              <ControlledInput
                name="email"
                control={control}
                label="이메일"
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledInput
                name="phone"
                control={control}
                label="전화번호"
                type="tel"
                placeholder="010-1234-5678"
                required
                description="'-'를 포함하여 입력해주세요."
              />

              <ControlledInput
                name="age"
                control={control}
                label="나이"
                type="text"
                placeholder="25"
                required
                description="14세 이상만 가입 가능합니다."
              />
            </div>
          </div>

          {/* 추가 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">추가 정보</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ControlledSelect
                name="country"
                control={control}
                label="국가"
                options={countryOptions}
                placeholder="국가를 선택해주세요"
                required
              />

              <ControlledSelect
                name="occupation"
                control={control}
                label="직업"
                options={occupationOptions}
                placeholder="직업을 선택해주세요"
              />
            </div>

            <ControlledTextarea
              name="bio"
              control={control}
              label="자기소개"
              placeholder="간단한 자기소개를 작성해주세요..."
              rows={4}
              maxLength={500}
              description="500자 이내로 작성해주세요."
            />
          </div>

          {/* 관심사 및 스킬 섹션 */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">관심사 및 스킬</h3>

            <ControlledCheckboxGroup
              name="interests"
              control={control}
              label="관심사"
              options={interestOptions}
              required
              minSelection={1}
              maxSelection={3}
              description="최소 1개, 최대 3개까지 선택 가능합니다."
            />

            <ControlledCheckboxGroup
              name="skills"
              control={control}
              label="보유 스킬"
              options={skillOptions}
              maxSelection={5}
              description="보유하신 스킬을 선택해주세요. (최대 5개)"
            />
          </div>

          {/* 약관 동의 섹션 */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">약관 동의</h3>

            <ControlledCheckbox
              name="agreeTerms"
              control={control}
              label="이용약관 및 개인정보처리방침에 동의합니다."
              required
            />

            <ControlledCheckbox
              name="agreeMarketing"
              control={control}
              label="마케팅 정보 수신에 동의합니다. (선택)"
              description="새로운 소식과 혜택을 이메일로 받아보실 수 있습니다."
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={!isValid || loading} className="flex-1">
              {loading ? '등록 중...' : '등록하기'}
            </Button>

            <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
              초기화
            </Button>
          </div>

          {/* 에러 요약 */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
              <h4 className="text-destructive mb-2 font-semibold">입력 오류</h4>
              <ul className="space-y-1 text-sm">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-destructive">
                    • {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
