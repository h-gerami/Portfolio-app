import {
  useInfiniteQuery,
  useIsFetching,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchProductsPage } from "./api";
import { PAGE_SIZE, PageResponse, Product } from "./types";
import { useEffect } from "react";

const key = (category: string) => ["products", category] as const;

export function useProductsInfinite(category: string) {
  return useInfiniteQuery<PageResponse, Error>({
    queryKey: key(category),
    queryFn: ({ pageParam = 0 }) => fetchProductsPage(category, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.products.length, 0);
      return loaded < lastPage.total ? allPages.length : undefined;
    },
  });
}

export function useFlattenPages(pages: PageResponse[] | undefined) {
  return (pages ?? []).flatMap((p) => p.products) as Product[];
}

// Optional: prefetch first page of “all” (largest dataset) on mount
export function usePrefetchAll() {
  const qc = useQueryClient();
  useEffect(() => {
    qc.prefetchInfiniteQuery({
      queryKey: key("all"),
      queryFn: ({ pageParam = 0 }) => fetchProductsPage("all", pageParam),
      initialPageParam: 0,
    });
  }, [qc]);
}

// global network flag for top bar
export function useGlobalIsFetching() {
  const fetching = useIsFetching();
  return fetching > 0;
}
