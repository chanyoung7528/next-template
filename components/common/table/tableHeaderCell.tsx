import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface TableHeaderCellProps {
  /** 헤더 셀에 표시될 내용 */
  children: ReactNode;
  /** 추가적인 스타일을 위한 className */
  className?: string;
}

/**
 * 테이블의 헤더 셀(th) 컴포넌트입니다.
 */
export const TableHeaderCell = ({ children, className }: TableHeaderCellProps) => {
  return (
    <th className={cn('bg-gray-100 p-3 text-left align-middle text-sm font-medium text-gray-800', className)}>
      {children}
    </th>
  );
};
