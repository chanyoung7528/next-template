import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  pageSize?: number;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  showGlobalFilter?: boolean;
  showPagination?: boolean;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  currentPage = 1,
  onPageChange,
  totalCount = 0,
  pageSize = 10,
  sorting = [],
  onSortingChange,
  showGlobalFilter = true,
  showPagination = true,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // 서버 사이드 페이징이니까 수동 페이징 사용
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
  };

  return (
    <div className="space-y-4">
      {showGlobalFilter && (
        <Input
          placeholder="전체 검색..."
          disabled={isLoading} // 로딩중 검색 비활성화 (필요시)
          className="max-w-sm"
          onChange={(e) => {
            table.setGlobalFilter(e.target.value);
          }}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    // 정렬 가능한 헤더에 클릭 이벤트 추가
                    onClick={header.column.getCanSort() ? () => header.column.toggleSorting() : undefined}
                    className={` ${index !== 0 ? 'border-l border-gray-300' : ''} cursor-pointer ${
                      header.column.getIsSorted() ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell className={index !== 0 ? 'border-l border-gray-300' : ''} key={cell.id}>
                      <div className={index === 0 ? 'flex items-center justify-center' : ''}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-end space-x-2">
          <div className="text-muted-foreground text-sm">
            페이지 {currentPage} / {Math.ceil(totalCount / pageSize)}
          </div>
          <div className="flex-1 justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalCount / pageSize)}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.ceil(totalCount / pageSize))}
              disabled={currentPage === Math.ceil(totalCount / pageSize)}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
