import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface TableRowProps {
  /** 행 내부에 들어갈 자식 요소들 (주로 TableHeaderCell, TableDataCell) */
  children: ReactNode;
  /** 추가적인 스타일을 위한 className */
  className?: string;
}

/**
 * 테이블의 행(tr) 컴포넌트입니다.
 */
export const TableRow = ({ children, className }: TableRowProps) => {
  return <tr className={cn('border-b border-gray-200 last:border-b-0', className)}>{children}</tr>;
};
