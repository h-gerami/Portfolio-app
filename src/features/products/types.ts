export type Product = {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  category?: string;
  images?: string[];
};

export type PageResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type TabType = { label: string; key: string };

export const PAGE_SIZE = 20;

export const TABS: TabType[] = [
  { label: "All", key: "all" },
  { label: "Smartphones", key: "smartphones" },
  { label: "Men's Shirts", key: "mens-shirts" },
  { label: "Women's Dresses", key: "womens-dresses" },
  { label: "Groceries", key: "groceries" },
];
