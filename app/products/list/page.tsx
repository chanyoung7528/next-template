'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProductList } from '@/services/product/list';
import { OnChangeFn, SortingState } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';

import { DataTable } from '@/components/common/data-table/data-table';
import SkeletonTable from '@/components/common/data-table/skeleton-table';
import { TableContainer, TableDataCell, TableHeaderCell, TableRow } from '@/components/common/table';
import { columns } from '@/components/page/product/columns';
// shadcn/ui 컴포넌트
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormValues = {
  category1: string;
  category2: string;
  showRecommended: { all: boolean; exhibited: boolean; notExhibited: boolean };
  showLuxury: { all: boolean; exhibited: boolean; notExhibited: boolean };
  dateType: string;
  startDate: string;
  endDate: string;
  searchType: string;
  searchKeyword: string;
};

const LIMIT = 10;
const TOTAL_COUNT = 200;

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
  };

  const { data, isLoading, isError, isFetching } = useProductList({
    page: currentPage,
    limit: LIMIT,
    sorting,
  });

  const form = useForm<FormValues>({
    defaultValues: {
      category1: 'all',
      category2: 'all',
      showRecommended: { all: true, exhibited: true, notExhibited: true },
      showLuxury: { all: true, exhibited: true, notExhibited: false },
      dateType: 'regDate',
      startDate: '2025-06-03',
      endDate: '2025-06-10',
      searchType: 'none',
      searchKeyword: '',
    },
  });

  if (isError) return <div>데이터 로딩 오류</div>;
  const showSkeleton = isLoading || (!data && isFetching);

  function onSubmit(data: FormValues) {
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
                            <SelectValue placeholder="전체" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="clothes">의류</SelectItem>
                          <SelectItem value="electronics">전자제품</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableDataCell>
              <TableHeaderCell>품목</TableHeaderCell>
              <TableDataCell>
                <FormField
                  control={form.control}
                  name="category1"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="전체" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          <SelectItem value="clothes">의류</SelectItem>
                          <SelectItem value="electronics">전자제품</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                  {/* '전시', '비전시'도 위와 같이 FormField로 구현 */}
                </div>
              </TableDataCell>
            </TableRow>

            {/* 기간 */}
            <TableRow>
              <TableHeaderCell>기간</TableHeaderCell>
              <TableDataCell className="border-l-0" colSpan={3}>
                <div className="flex flex-wrap items-center gap-2">
                  <FormField
                    control={form.control}
                    name="dateType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regDate">등록일</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => <Input type="date" {...field} className="w-auto" />}
                  />
                  <span>~</span>
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => <Input type="date" {...field} className="w-auto" />}
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
                    name="searchType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">사용안함</SelectItem>
                          {/* 다른 옵션 추가 */}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="searchKeyword"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="최대 50개까지 입력 가능합니다." {...field} />
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
            <Button type="button" variant="outline">
              초기화
            </Button>
            <Button type="submit">검색</Button>
          </div>
        </form>
      </Form>

      <div className="flex justify-end">
        <Button>
          <Link href="/products/create">상품 등록</Link>
        </Button>
      </div>

      {showSkeleton ? (
        <SkeletonTable />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalCount={TOTAL_COUNT}
          pageSize={LIMIT}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          showGlobalFilter
          showPagination
          isLoading={isLoading || isFetching}
        />
      )}
    </div>
  );
}
