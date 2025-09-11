import { z } from 'zod';

// 동적 연락처 목록 스키마 (useFieldArray)
export const dynamicContactsSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  company: z.string().optional(),
  contacts: z
    .array(
      z.object({
        type: z.enum(['email', 'phone', 'website'], {
          required_error: '연락처 타입을 선택해주세요.',
        }),
        value: z.string().min(1, '연락처 정보를 입력해주세요.'),
        isPrimary: z.boolean().default(false),
        label: z.string().optional(),
      })
    )
    .min(1, '최소 1개의 연락처를 추가해주세요.')
    .max(10, '최대 10개까지 추가 가능합니다.'),
});

// 경력 관리 스키마
export const experienceManagementSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, '이름을 입력해주세요.'),
    title: z.string().min(1, '직책을 입력해주세요.'),
    summary: z.string().max(500, '요약은 500자 이하로 입력해주세요.').optional(),
  }),
  experiences: z
    .array(
      z.object({
        company: z.string().min(1, '회사명을 입력해주세요.'),
        position: z.string().min(1, '직책을 입력해주세요.'),
        startDate: z.string().min(1, '시작일을 입력해주세요.'),
        endDate: z.string().optional(),
        isCurrent: z.boolean().default(false),
        description: z.string().max(1000, '설명은 1000자 이하로 입력해주세요.').optional(),
        skills: z.array(z.string()).optional(),
        achievements: z
          .array(
            z.object({
              title: z.string().min(1, '성과 제목을 입력해주세요.'),
              description: z.string().optional(),
              metrics: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .min(1, '최소 1개의 경력을 추가해주세요.'),
  skills: z.array(z.string()).optional(),
});

// 복잡한 조건부 주문 폼 스키마
export const conditionalOrderSchema = z
  .object({
    customerType: z.enum(['individual', 'business', 'government'], {
      required_error: '고객 유형을 선택해주세요.',
    }),

    // 기본 정보
    customerInfo: z.object({
      name: z.string().min(1, '이름/회사명을 입력해주세요.'),
      email: z.string().email('올바른 이메일 형식이 아닙니다.'),
      phone: z.string().regex(/^010-\d{4}-\d{4}$/, '전화번호 형식: 010-1234-5678'),
    }),

    // 개인 고객 전용
    individualInfo: z
      .object({
        birthDate: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),

    // 사업자 전용
    businessInfo: z
      .object({
        companyName: z.string().optional(),
        businessNumber: z.string().optional(),
        representativeName: z.string().optional(),
        businessAddress: z.string().optional(),
        taxInvoice: z.boolean().default(false),
      })
      .optional(),

    // 정부기관 전용
    governmentInfo: z
      .object({
        departmentName: z.string().optional(),
        contactPerson: z.string().optional(),
        purchaseOrderNumber: z.string().optional(),
      })
      .optional(),

    // 주문 정보
    orderType: z.enum(['product', 'service', 'subscription'], {
      required_error: '주문 유형을 선택해주세요.',
    }),

    // 제품 주문 시
    productOrder: z
      .object({
        items: z
          .array(
            z.object({
              productId: z.string().min(1, '상품을 선택해주세요.'),
              quantity: z.number().min(1, '수량은 1개 이상이어야 합니다.'),
              unitPrice: z.number().min(0, '단가를 입력해주세요.'),
              discount: z.number().min(0).max(100, '할인율은 0-100% 사이여야 합니다.').default(0),
            })
          )
          .min(1, '최소 1개의 상품을 선택해주세요.')
          .optional(),
        shippingAddress: z.string().optional(),
        shippingMethod: z.enum(['standard', 'express', 'overnight']).optional(),
      })
      .optional(),

    // 서비스 주문 시
    serviceOrder: z
      .object({
        serviceType: z.string().optional(),
        startDate: z.string().optional(),
        duration: z.number().optional(),
        requirements: z.string().optional(),
      })
      .optional(),

    // 구독 주문 시
    subscriptionOrder: z
      .object({
        plan: z.string().optional(),
        billingCycle: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
        autoRenewal: z.boolean().default(true),
      })
      .optional(),

    // 결제 정보
    paymentMethod: z.enum(['card', 'bank', 'cash'], {
      required_error: '결제 방법을 선택해주세요.',
    }),

    // 할인 혜택
    discounts: z
      .array(
        z.object({
          code: z.string().min(1, '쿠폰 코드를 입력해주세요.'),
          value: z.number().min(0, '할인값을 입력해주세요.'),
          type: z.enum(['percentage', 'fixed']),
        })
      )
      .optional(),

    // 추가 요청사항
    specialRequests: z.string().max(1000, '요청사항은 1000자 이하로 입력해주세요.').optional(),

    // 약관 동의
    agreements: z.object({
      termsOfService: z.boolean().refine((val) => val === true, '서비스 이용약관에 동의해주세요.'),
      privacyPolicy: z.boolean().refine((val) => val === true, '개인정보처리방침에 동의해주세요.'),
      marketing: z.boolean().default(false),
    }),
  })
  .refine(
    (data) => {
      // 고객 유형별 필수 정보 검증
      if (data.customerType === 'individual') {
        return data.individualInfo?.birthDate && data.individualInfo?.address;
      }
      if (data.customerType === 'business') {
        return (
          data.businessInfo?.companyName && data.businessInfo?.businessNumber && data.businessInfo?.representativeName
        );
      }
      if (data.customerType === 'government') {
        return data.governmentInfo?.departmentName && data.governmentInfo?.contactPerson;
      }
      return true;
    },
    {
      message: '선택한 고객 유형에 맞는 필수 정보를 입력해주세요.',
      path: ['customerType'],
    }
  )
  .refine(
    (data) => {
      // 주문 유형별 필수 정보 검증
      if (data.orderType === 'product') {
        return data.productOrder?.items && data.productOrder.items.length > 0;
      }
      if (data.orderType === 'service') {
        return data.serviceOrder?.serviceType && data.serviceOrder?.startDate;
      }
      if (data.orderType === 'subscription') {
        return data.subscriptionOrder?.plan && data.subscriptionOrder?.billingCycle;
      }
      return true;
    },
    {
      message: '선택한 주문 유형에 맞는 정보를 입력해주세요.',
      path: ['orderType'],
    }
  );

// 실시간 계산 폼 스키마 (견적서)
export const realTimeCalculationSchema = z.object({
  projectInfo: z.object({
    name: z.string().min(1, '프로젝트명을 입력해주세요.'),
    description: z.string().max(500, '설명은 500자 이하로 입력해주세요.').optional(),
    startDate: z.string().min(1, '시작일을 선택해주세요.'),
    endDate: z.string().min(1, '종료일을 선택해주세요.'),
  }),

  services: z
    .array(
      z.object({
        category: z.string().min(1, '서비스 카테고리를 선택해주세요.'),
        service: z.string().min(1, '서비스를 선택해주세요.'),
        quantity: z.number().min(1, '수량은 1 이상이어야 합니다.'),
        unitPrice: z.number().min(0, '단가를 입력해주세요.'),
        discount: z.number().min(0).max(100, '할인율은 0-100% 사이여야 합니다.').default(0),
        taxRate: z.number().min(0).max(100, '세율은 0-100% 사이여야 합니다.').default(10),
      })
    )
    .min(1, '최소 1개의 서비스를 추가해주세요.'),

  additionalOptions: z.object({
    expediteFee: z.boolean().default(false),
    expediteFeeRate: z.number().default(20),
    supportPackage: z.boolean().default(false),
    supportPackageRate: z.number().default(15),
    warrantyCoverage: z.boolean().default(false),
    warrantyCoverageRate: z.number().default(5),
  }),

  clientInfo: z.object({
    isVip: z.boolean().default(false),
    vipDiscountRate: z.number().default(5),
    loyaltyPoints: z.number().min(0).default(0),
    pointsRedemptionRate: z.number().default(0.1),
  }),
});

// 다단계 위자드 스키마 (회사 설정)
export const multiStepCompanySetupSchema = z.object({
  // Step 1: 기본 정보
  basicInfo: z.object({
    companyName: z.string().min(1, '회사명을 입력해주세요.'),
    businessType: z.enum(['corporation', 'llc', 'partnership', 'sole_proprietorship'], {
      required_error: '사업 유형을 선택해주세요.',
    }),
    industry: z.string().min(1, '업종을 선택해주세요.'),
    foundedYear: z.number().min(1900).max(new Date().getFullYear()),
    employees: z.number().min(1, '직원 수를 입력해주세요.'),
  }),

  // Step 2: 주소 및 연락처
  contactInfo: z.object({
    headquarters: z.object({
      country: z.string().min(1, '국가를 선택해주세요.'),
      city: z.string().min(1, '도시를 입력해주세요.'),
      address: z.string().min(1, '주소를 입력해주세요.'),
      postalCode: z.string().min(1, '우편번호를 입력해주세요.'),
    }),
    contact: z.object({
      phone: z.string().regex(/^[0-9-+().\s]+$/, '올바른 전화번호 형식이 아닙니다.'),
      email: z.string().email('올바른 이메일 형식이 아닙니다.'),
      website: z.string().url('올바른 웹사이트 URL을 입력해주세요.').optional(),
    }),
  }),

  // Step 3: 부서 및 팀 구조
  departments: z
    .array(
      z.object({
        name: z.string().min(1, '부서명을 입력해주세요.'),
        description: z.string().optional(),
        headCount: z.number().min(1, '인원 수를 입력해주세요.'),
        budget: z.number().min(0, '예산을 입력해주세요.').optional(),
        teams: z
          .array(
            z.object({
              name: z.string().min(1, '팀명을 입력해주세요.'),
              lead: z.string().min(1, '팀장을 입력해주세요.'),
              members: z.number().min(1, '팀원 수를 입력해주세요.'),
            })
          )
          .optional(),
      })
    )
    .min(1, '최소 1개의 부서를 추가해주세요.'),

  // Step 4: 시스템 설정
  systemSettings: z.object({
    workingHours: z.object({
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '시간 형식: HH:MM'),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '시간 형식: HH:MM'),
      workingDays: z.array(z.string()).min(1, '최소 1개의 근무일을 선택해주세요.'),
    }),
    holidays: z
      .array(
        z.object({
          name: z.string().min(1, '휴일명을 입력해주세요.'),
          date: z.string().min(1, '날짜를 선택해주세요.'),
          type: z.enum(['national', 'company', 'religious']),
        })
      )
      .optional(),
    policies: z.object({
      vacationPolicy: z.string().max(1000, '휴가 정책은 1000자 이하로 입력해주세요.').optional(),
      remoteWorkPolicy: z.boolean().default(false),
      overtimePolicy: z.string().max(1000, '초과근무 정책은 1000자 이하로 입력해주세요.').optional(),
    }),
  }),
});

// 타입 추론
export type DynamicContactsData = z.infer<typeof dynamicContactsSchema>;
export type ExperienceManagementData = z.infer<typeof experienceManagementSchema>;
export type ConditionalOrderData = z.infer<typeof conditionalOrderSchema>;
export type RealTimeCalculationData = z.infer<typeof realTimeCalculationSchema>;
export type MultiStepCompanySetupData = z.infer<typeof multiStepCompanySetupSchema>;

// 옵션 상수들
export const CONTACT_TYPES = [
  { value: 'email', label: '이메일' },
  { value: 'phone', label: '전화번호' },
  { value: 'website', label: '웹사이트' },
];

export const CUSTOMER_TYPES = [
  { value: 'individual', label: '개인' },
  { value: 'business', label: '사업자' },
  { value: 'government', label: '정부기관' },
];

export const ORDER_TYPES = [
  { value: 'product', label: '제품 주문' },
  { value: 'service', label: '서비스 주문' },
  { value: 'subscription', label: '구독 주문' },
];

export const BUSINESS_TYPES = [
  { value: 'corporation', label: '주식회사' },
  { value: 'llc', label: '유한회사' },
  { value: 'partnership', label: '합명회사' },
  { value: 'sole_proprietorship', label: '개인사업자' },
];

export const INDUSTRIES = [
  { value: 'technology', label: '기술/IT' },
  { value: 'finance', label: '금융' },
  { value: 'healthcare', label: '헬스케어' },
  { value: 'education', label: '교육' },
  { value: 'manufacturing', label: '제조업' },
  { value: 'retail', label: '소매업' },
  { value: 'consulting', label: '컨설팅' },
];

export const SERVICE_CATEGORIES = [
  {
    value: 'development',
    label: '개발',
    services: [
      { value: 'web_development', label: '웹 개발', basePrice: 1000000 },
      { value: 'mobile_development', label: '모바일 앱 개발', basePrice: 1500000 },
      { value: 'api_development', label: 'API 개발', basePrice: 500000 },
    ],
  },
  {
    value: 'design',
    label: '디자인',
    services: [
      { value: 'ui_design', label: 'UI 디자인', basePrice: 300000 },
      { value: 'ux_design', label: 'UX 디자인', basePrice: 500000 },
      { value: 'branding', label: '브랜딩', basePrice: 800000 },
    ],
  },
  {
    value: 'consulting',
    label: '컨설팅',
    services: [
      { value: 'business_consulting', label: '비즈니스 컨설팅', basePrice: 2000000 },
      { value: 'tech_consulting', label: '기술 컨설팅', basePrice: 1800000 },
      { value: 'marketing_consulting', label: '마케팅 컨설팅', basePrice: 1200000 },
    ],
  },
];

export const WORKING_DAYS = [
  { value: 'monday', label: '월요일' },
  { value: 'tuesday', label: '화요일' },
  { value: 'wednesday', label: '수요일' },
  { value: 'thursday', label: '목요일' },
  { value: 'friday', label: '금요일' },
  { value: 'saturday', label: '토요일' },
  { value: 'sunday', label: '일요일' },
];
