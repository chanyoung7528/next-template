'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TableContainer, TableDataCell, TableHeaderCell, TableRow } from '@/components/common/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, // FormMessage를 사용해 에러를 표시합니다.
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productSchema, type ProductFormValues } from '@/lib/schema/product';

export default function ProductCreate() {
  const router = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category1: '', // 빈 값으로 시작하여 필수 선택 에러 확인
      category2: '', // 빈 값으로 시작하여 필수 선택 에러 확인
      showRecommended: { all: true, exhibited: true, notExhibited: true },
      showLuxury: { all: true, exhibited: true, notExhibited: false },
      dateType: 'regDate',
      startDate: '2025-06-10',
      endDate: '2025-06-17',
      searchType: 'none',
      searchKeyword: '',
    },
  });

  function onSubmit(data: ProductFormValues) {
    console.log('Form submitted:', data);
    // TODO: API 호출 등 데이터 처리 로직 구현
  }

  const colWidths = ['w-40', 'w-[calc(50%-8rem)]', 'w-40', 'w-[calc(50%-8rem)]'];

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TableContainer colWidths={colWidths}>
            {/* 품목 */}
            <TableRow>
              <TableHeaderCell>품목</TableHeaderCell>
              <TableDataCell className="border-l-0">
                <FormField
                  control={form.control}
                  name="category1"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="품목 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clothes">의류</SelectItem>
                          <SelectItem value="electronics">전자제품</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage /> {/* 에러 메시지 표시 영역 */}
                    </FormItem>
                  )}
                />
              </TableDataCell>
              <TableHeaderCell>품목</TableHeaderCell>
              <TableDataCell>
                {/* 2. 필드 이름을 category2로 수정 */}
                <FormField
                  control={form.control}
                  name="category2"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="품목 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="clothes">의류</SelectItem>
                          <SelectItem value="electronics">전자제품</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage /> {/* 에러 메시지 표시 영역 */}
                    </FormItem>
                  )}
                />
              </TableDataCell>
            </TableRow>

            {/* 추천 브랜드 전시 여부 */}
            <TableRow>
              <TableHeaderCell>추천 브랜드 전시 여부</TableHeaderCell>
              <TableDataCell className="border-l-0" colSpan={3}>
                <div className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name="showRecommended.all"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">전체</FormLabel>
                      </FormItem>
                    )}
                  />
                  {/* '전시', '비전시'도 동일하게 구현 */}
                </div>
              </TableDataCell>
            </TableRow>

            {/* 기간 */}
            <TableRow>
              <TableHeaderCell>기간</TableHeaderCell>
              <TableDataCell className="border-l-0" colSpan={3}>
                <div className="flex flex-wrap items-center gap-2">
                  {/* 3. 각 FormField를 FormItem으로 감싸고 FormMessage 추가 */}
                  <FormField
                    control={form.control}
                    name="dateType"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="regDate">등록일</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="date" {...field} className="w-auto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span>~</span>
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="date" {...field} className="w-auto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['오늘', '7일', '1개월', '3개월', '1년'].map((label) => (
                    <Button key={label} type="button" variant={'outline'} size="sm">
                      {label}
                    </Button>
                  ))}
                </div>
              </TableDataCell>
            </TableRow>

            {/* 검색어 */}
            <TableRow>
              <TableHeaderCell>검색어</TableHeaderCell>
              <TableDataCell className="border-l-0" colSpan={3}>
                <div className="flex flex-wrap items-center gap-2">
                  <FormField
                    control={form.control}
                    name="searchKeyword"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="최대 50자까지 입력 가능합니다." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TableDataCell>
            </TableRow>
          </TableContainer>

          <div className="flex justify-center space-x-2">
            <Button size="lg" type="button" variant="outline" onClick={() => router.push('/products/list')}>
              취소
            </Button>
            <Button size="lg" type="submit">
              등록
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
