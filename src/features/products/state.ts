import { useMemo, useState } from "react";
import type { Product } from "./types";

export type SortKey = "priceAsc" | "priceDesc" | "titleAsc" | null;

export function useProductFilters() {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<SortKey>(null);

  const clear = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSort(null);
  };

  return {
    query,
    setQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sort,
    setSort,
    clear,
  };
}

export function useApplyFilters(
  products: Product[],
  opts: {
    query: string;
    minPrice: string;
    maxPrice: string;
    sort: SortKey;
  },
) {
  const { query, minPrice, maxPrice, sort } = opts;
  return useMemo(() => {
    let arr = products;

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (p) =>
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q),
      );
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!Number.isNaN(min)) arr = arr.filter((p) => p.price >= min);
    if (!Number.isNaN(max) && max > 0) arr = arr.filter((p) => p.price <= max);

    if (sort === "priceAsc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") arr = [...arr].sort((a, b) => b.price - a.price);
    if (sort === "titleAsc")
      arr = [...arr].sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? ""),
      );

    return arr;
  }, [products, query, minPrice, maxPrice, sort]);
}
