import { PetProduct } from "./types";

// API Base URL - Replace with your actual backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

// API Configuration
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please check your connection.");
    }
    throw error;
  }
}

// Products API
export async function fetchProducts(): Promise<PetProduct[]> {
  // For now, return mock data. Replace with actual API call:
  // return apiCall<PetProduct[]>("/api/products");
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Import mock data
  const { petProducts } = await import("./data");
  return petProducts;
}

export async function fetchProductById(id: string): Promise<PetProduct> {
  // return apiCall<PetProduct>(`/api/products/${id}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { petProducts } = await import("./data");
  const product = petProducts.find((p) => p.id === id);
  if (!product) throw new Error("Product not found");
  return product;
}

// Cart API
export type CartItemResponse = {
  id: string;
  productId: string;
  quantity: number;
  product: PetProduct;
  createdAt: string;
  updatedAt: string;
};

export type CartResponse = {
  id: string;
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
};

export async function fetchCart(): Promise<CartResponse> {
  // return apiCall<CartResponse>("/api/cart");
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  // Simulate empty cart from backend
  return {
    id: "cart-1",
    items: [],
    totalItems: 0,
    totalPrice: 0,
    updatedAt: new Date().toISOString(),
  };
}

export async function addToCartAPI(
  productId: string,
  quantity: number
): Promise<CartItemResponse> {
  // return apiCall<CartItemResponse>("/api/cart/items", {
  //   method: "POST",
  //   body: JSON.stringify({ productId, quantity }),
  // });
  
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const { petProducts } = await import("./data");
  const product = petProducts.find((p) => p.id === productId);
  if (!product) throw new Error("Product not found");
  
  return {
    id: `cart-item-${Date.now()}`,
    productId,
    quantity,
    product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateCartItemAPI(
  itemId: string,
  quantity: number
): Promise<CartItemResponse> {
  // return apiCall<CartItemResponse>(`/api/cart/items/${itemId}`, {
  //   method: "PATCH",
  //   body: JSON.stringify({ quantity }),
  // });
  
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Simulate update
  return {
    id: itemId,
    productId: "product-1",
    quantity,
    product: {} as PetProduct,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function removeCartItemAPI(itemId: string): Promise<void> {
  // return apiCall<void>(`/api/cart/items/${itemId}`, {
  //   method: "DELETE",
  // });
  
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export async function clearCartAPI(): Promise<void> {
  // return apiCall<void>("/api/cart", {
  //   method: "DELETE",
  // });
  
  await new Promise((resolve) => setTimeout(resolve, 500));
}

