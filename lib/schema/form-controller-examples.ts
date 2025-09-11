import { z } from 'zod';

// 간단한 연락처 폼 스키마
export const contactFormSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  message: z.string().min(10, '메시지는 최소 10자 이상 입력해주세요.'),
});

// 사용자 프로필 폼 스키마
export const userProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50자 이하로 입력해주세요.'),
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  bio: z.string().max(500, '자기소개는 500자 이하로 입력해주세요.').optional(),
  country: z.string().min(1, '국가를 선택해주세요.'),
  agreeTerms: z.boolean().refine((val) => val === true, '이용약관에 동의해주세요.'),
});

// 제품 리뷰 폼 스키마
export const productReviewSchema = z.object({
  rating: z.number().min(1, '평점을 선택해주세요.').max(5),
  title: z.string().min(5, '제목은 최소 5자 이상 입력해주세요.').max(100, '제목은 100자 이하로 입력해주세요.'),
  content: z
    .string()
    .min(20, '리뷰 내용은 최소 20자 이상 입력해주세요.')
    .max(1000, '리뷰는 1000자 이하로 입력해주세요.'),
  recommendToFriends: z.boolean().default(false),
  categories: z.array(z.string()).min(1, '최소 1개의 카테고리를 선택해주세요.'),
});

// 설정 폼 스키마
export const settingsFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], { required_error: '테마를 선택해주세요.' }),
  language: z.string().min(1, '언어를 선택해주세요.'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false),
  }),
  features: z.array(z.string()).optional(),
});

// 동적 필드 폼 스키마
export const dynamicFormSchema = z
  .object({
    userType: z.enum(['individual', 'business'], { required_error: '사용자 유형을 선택해주세요.' }),
    name: z.string().min(1, '이름을 입력해주세요.'),
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),

    // 개인 사용자 필드
    personalCode: z.string().optional(),
    birthDate: z.string().optional(),

    // 사업자 필드
    companyName: z.string().optional(),
    businessNumber: z.string().optional(),
    businessAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.userType === 'individual') {
        return data.personalCode && data.birthDate;
      }
      if (data.userType === 'business') {
        return data.companyName && data.businessNumber;
      }
      return true;
    },
    {
      message: '선택한 사용자 유형에 맞는 필수 정보를 입력해주세요.',
      path: ['userType'],
    }
  );

// 파일 업로드 포함 폼 스키마
export const fileUploadFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  description: z.string().optional(),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  tags: z.array(z.string()).max(5, '태그는 최대 5개까지 가능합니다.').optional(),
  isPublic: z.boolean().default(false),
  allowComments: z.boolean().default(true),
});

// 타입 추론
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type ProductReviewData = z.infer<typeof productReviewSchema>;
export type SettingsFormData = z.infer<typeof settingsFormSchema>;
export type DynamicFormData = z.infer<typeof dynamicFormSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadFormSchema>;

// 옵션 상수들
export const COUNTRIES = [
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
  { value: 'JP', label: '일본' },
  { value: 'CN', label: '중국' },
  { value: 'UK', label: '영국' },
  { value: 'DE', label: '독일' },
  { value: 'FR', label: '프랑스' },
];

export const THEMES = [
  { value: 'light', label: '라이트 모드' },
  { value: 'dark', label: '다크 모드' },
  { value: 'system', label: '시스템 설정' },
];

export const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
];

export const CATEGORIES = [
  { value: 'electronics', label: '전자제품' },
  { value: 'clothing', label: '의류' },
  { value: 'books', label: '도서' },
  { value: 'food', label: '식품' },
  { value: 'sports', label: '스포츠' },
  { value: 'beauty', label: '뷰티' },
];

export const FEATURES = [
  { value: 'darkMode', label: '다크 모드' },
  { value: 'notifications', label: '알림' },
  { value: 'autoSave', label: '자동 저장' },
  { value: 'keyboard', label: '키보드 단축키' },
  { value: 'analytics', label: '분석' },
];

export const TAGS = [
  'React',
  'TypeScript',
  'Next.js',
  'UI/UX',
  'Frontend',
  'Backend',
  'Database',
  'API',
  'Mobile',
  'Desktop',
] as const;
