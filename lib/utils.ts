import { SortingState } from '@tanstack/react-table';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildQueryParams = (page: number, limit: number, sorting: SortingState, filter?: string) => {
  const params = new URLSearchParams();
  params.append('_page', String(page));
  params.append('_limit', String(limit));

  if (sorting.length > 0) {
    params.append('_sort', sorting[0].id);
    params.append('_order', sorting[0].desc ? 'desc' : 'asc');
  }

  if (filter) {
    params.append('q', filter); // json-server의 간단한 검색을 위한 'q'
  }

  return params.toString();
};
