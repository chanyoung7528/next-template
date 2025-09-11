import { z } from 'zod';

// 기본 폼 스키마
export const basicFormSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50글자 이하여야 합니다.'),
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  age: z.number().min(1, '나이를 입력해주세요.').max(120, '올바른 나이를 입력해주세요.'),
  message: z.string().optional(),
});

// 동적 필드 스키마
export const dynamicFieldSchema = z
  .object({
    type: z.enum(['personal', 'business'], {
      required_error: '유형을 선택해주세요.',
    }),
    name: z.string().min(1, '이름을 입력해주세요.'),
    // 동적 필드들
    company: z.string().optional(),
    businessNumber: z.string().optional(),
    website: z.string().url('올바른 웹사이트 URL을 입력해주세요.').optional(),
    personalId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'business') {
        return data.company && data.businessNumber;
      }
      if (data.type === 'personal') {
        return data.personalId;
      }
      return true;
    },
    {
      message: '선택한 유형에 따른 필수 정보를 입력해주세요.',
      path: ['type'],
    }
  );

// 중첩 객체 스키마
export const nestedObjectSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  address: z.object({
    street: z.string().min(1, '도로명을 입력해주세요.'),
    city: z.string().min(1, '시/도를 입력해주세요.'),
    zipCode: z.string().regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다.'),
    country: z.string().min(1, '국가를 선택해주세요.'),
  }),
  contact: z.object({
    phone: z.string().regex(/^010-\d{4}-\d{4}$/, '전화번호 형식: 010-1234-5678'),
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    emergencyContact: z.object({
      name: z.string().min(1, '비상연락처 이름을 입력해주세요.'),
      phone: z.string().regex(/^010-\d{4}-\d{4}$/, '전화번호 형식: 010-1234-5678'),
      relation: z.string().min(1, '관계를 입력해주세요.'),
    }),
  }),
});

// 배열 필드 스키마
export const arrayFieldSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  skills: z.array(z.string().min(1, '스킬을 입력해주세요.')).min(1, '최소 1개의 스킬을 추가해주세요.'),
  experiences: z
    .array(
      z.object({
        company: z.string().min(1, '회사명을 입력해주세요.'),
        position: z.string().min(1, '직책을 입력해주세요.'),
        startDate: z.string().min(1, '시작일을 입력해주세요.'),
        endDate: z.string().optional(),
        current: z.boolean().default(false),
        description: z.string().optional(),
      })
    )
    .min(1, '최소 1개의 경력을 추가해주세요.'),
  education: z
    .array(
      z.object({
        school: z.string().min(1, '학교명을 입력해주세요.'),
        degree: z.string().min(1, '학위를 입력해주세요.'),
        major: z.string().min(1, '전공을 입력해주세요.'),
        graduationYear: z
          .number()
          .min(1950, '올바른 졸업년도를 입력해주세요.')
          .max(new Date().getFullYear() + 10, '올바른 졸업년도를 입력해주세요.'),
      })
    )
    .optional(),
});

// 조건부 필드 스키마
export const conditionalFieldSchema = z
  .object({
    userType: z.enum(['student', 'employee', 'freelancer'], {
      required_error: '사용자 유형을 선택해주세요.',
    }),
    name: z.string().min(1, '이름을 입력해주세요.'),
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),

    // 학생 전용 필드
    school: z.string().optional(),
    studentId: z.string().optional(),
    grade: z.number().optional(),

    // 직장인 전용 필드
    company: z.string().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    salary: z.number().optional(),

    // 프리랜서 전용 필드
    skills: z.array(z.string()).optional(),
    hourlyRate: z.number().optional(),
    portfolio: z.string().url('올바른 URL을 입력해주세요.').optional(),
  })
  .refine(
    (data) => {
      switch (data.userType) {
        case 'student':
          return data.school && data.studentId && data.grade;
        case 'employee':
          return data.company && data.department && data.position;
        case 'freelancer':
          return data.skills && data.skills.length > 0 && data.hourlyRate;
        default:
          return true;
      }
    },
    {
      message: '선택한 사용자 유형에 맞는 필수 정보를 입력해주세요.',
      path: ['userType'],
    }
  );

// 파일 업로드 스키마
export const fileUploadSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  avatar: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024,
      '파일 크기는 5MB 이하여야 합니다.'
    )
    .refine(
      (files) => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/gif'].includes(files[0].type),
      '이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF)'
    ),
  documents: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length <= 5, '최대 5개의 파일까지 업로드 가능합니다.')
    .refine(
      (files) => !files || Array.from(files).every((file) => file.size <= 10 * 1024 * 1024),
      '각 파일의 크기는 10MB 이하여야 합니다.'
    ),
});

// 타입 추론
export type BasicFormData = z.infer<typeof basicFormSchema>;
export type DynamicFieldData = z.infer<typeof dynamicFieldSchema>;
export type NestedObjectData = z.infer<typeof nestedObjectSchema>;
export type ArrayFieldData = z.infer<typeof arrayFieldSchema>;
export type ConditionalFieldData = z.infer<typeof conditionalFieldSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;

// 상수
export const USER_TYPES = [
  { value: 'student', label: '학생' },
  { value: 'employee', label: '직장인' },
  { value: 'freelancer', label: '프리랜서' },
] as const;

export const COUNTRIES = [
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
  { value: 'JP', label: '일본' },
  { value: 'CN', label: '중국' },
] as const;

export const SKILLS_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Go',
  'HTML/CSS',
  'UI/UX Design',
  'DevOps',
  'Database',
  'Mobile Development',
];

export const DEGREES = ['고등학교 졸업', '전문학사', '학사', '석사', '박사'];

export const RELATIONS = ['부모', '배우자', '형제자매', '친구', '동료', '기타'];
