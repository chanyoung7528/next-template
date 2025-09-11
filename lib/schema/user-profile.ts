import { z } from 'zod';

// 사용자 프로필 스키마
export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .min(2, '이름은 최소 2글자 이상이어야 합니다.')
    .max(20, '이름은 최대 20글자까지 가능합니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다.'),

  lastName: z
    .string()
    .min(1, '성을 입력해주세요.')
    .min(1, '성은 최소 1글자 이상이어야 합니다.')
    .max(20, '성은 최대 20글자까지 가능합니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '성은 한글, 영문만 입력 가능합니다.'),

  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.')
    .max(100, '이메일은 최대 100글자까지 가능합니다.'),

  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요.')
    .regex(/^010-\d{4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'),

  age: z
    .number({
      required_error: '나이를 입력해주세요.',
      invalid_type_error: '나이는 숫자여야 합니다.',
    })
    .min(14, '14세 이상만 가입 가능합니다.')
    .max(100, '100세 이하만 가입 가능합니다.'),

  bio: z.string().max(500, '자기소개는 최대 500글자까지 가능합니다.').optional(),

  interests: z
    .array(z.string())
    .min(1, '최소 1개 이상의 관심사를 선택해주세요.')
    .max(5, '최대 5개까지 선택 가능합니다.'),

  newsletter: z.boolean(),

  terms: z.boolean().refine((val) => val === true, {
    message: '이용약관에 동의해주세요.',
  }),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// 서버 응답 스키마
export const userProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: userProfileSchema.optional(),
  errors: z.record(z.string()).optional(),
});

export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;

// 관심사 옵션들
export const INTEREST_OPTIONS = [
  { value: 'technology', label: '기술/IT' },
  { value: 'sports', label: '스포츠' },
  { value: 'music', label: '음악' },
  { value: 'movies', label: '영화' },
  { value: 'books', label: '독서' },
  { value: 'travel', label: '여행' },
  { value: 'cooking', label: '요리' },
  { value: 'art', label: '예술' },
  { value: 'games', label: '게임' },
  { value: 'fitness', label: '피트니스' },
] as const;
