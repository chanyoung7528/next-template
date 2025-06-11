import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface TableContainerProps {
  /** col 태그에 적용할 너비 클래스 이름 배열 (e.g., ['w-40', 'w-[55%]']) */
  colWidths: string[];
  /** 테이블의 tbody에 들어갈 자식 요소들 (주로 TableRow 컴포넌트) */
  children: ReactNode;
  /** 추가적인 스타일을 위한 className */
  className?: string;
}

/**
 * 테이블의 최상위 컨테이너입니다. colgroup을 설정하고 tbody 내용을 children으로 받습니다.
 */
export const TableContainer = ({ colWidths, children, className }: TableContainerProps) => {
  return (
    <table className={cn('w-full table-fixed border-collapse border border-gray-200', className)}>
      <colgroup>
        {colWidths.map((width, index) => (
          <col key={index} className={width} />
        ))}
      </colgroup>
      <tbody>{children}</tbody>
    </table>
  );
};
