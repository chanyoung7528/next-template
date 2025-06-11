import { z } from 'zod';

export const productSchema = z.object({
  category1: z.string().min(1, { message: '첫 번째 품목을 선택해주세요.' }),
  category2: z.string().min(1, { message: '두 번째 품목을 선택해주세요.' }),
  showRecommended: z.object({
    all: z.boolean(),
    exhibited: z.boolean(),
    notExhibited: z.boolean(),
  }),
  showLuxury: z.object({
    all: z.boolean(),
    exhibited: z.boolean(),
    notExhibited: z.boolean(),
  }),
  dateType: z.string(),
  startDate: z.string().min(1, { message: '시작일을 선택해주세요.' }),
  endDate: z.string().min(1, { message: '종료일을 선택해주세요.' }),
  searchType: z.string(),
  searchKeyword: z
    .string()
    .min(1, { message: '검색어를 입력해주세요.' })
    .max(50, { message: '검색어는 50자 이내로 입력해주세요.' })
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
