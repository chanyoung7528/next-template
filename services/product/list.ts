import { useQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

import { ProductDataTableModel } from '@/types/product';
import { apiRequest } from '@/lib/apiClient';
import { buildQueryParams } from '@/lib/utils';

interface UsePostsOptions {
  page: number;
  limit: number;
  sorting: SortingState;
  filter?: string;
}

export const useProductList = ({ page, limit, sorting, filter }: UsePostsOptions) =>
  useQuery<ProductDataTableModel[]>({
    queryKey: ['posts', page, sorting, filter],
    queryFn: () => {
      const query = buildQueryParams(page, limit, sorting, filter);
      return apiRequest(`/posts?${query}`);
    },
    placeholderData: (prev) => prev,
  });
