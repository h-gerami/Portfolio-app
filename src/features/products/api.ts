import { PAGE_SIZE, PageResponse } from "./types";

export async function fetchProductsPage(
  category: string,
  page: number,
): Promise<PageResponse> {
  const skip = page * PAGE_SIZE;
  const url =
    category === "all"
      ? `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
      : `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${PAGE_SIZE}&skip=${skip}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
