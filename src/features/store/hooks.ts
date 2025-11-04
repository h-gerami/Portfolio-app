import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCartAPI,
  clearCartAPI,
  fetchCart,
  fetchProductById,
  fetchProducts,
  removeCartItemAPI,
  updateCartItemAPI,
} from "./api";
import { PetProduct } from "./types";

// Query Keys
export const queryKeys = {
  products: ["store", "products"] as const,
  product: (id: string) => ["store", "product", id] as const,
  cart: ["store", "cart"] as const,
};

// Products Queries
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Cart Queries
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: fetchCart,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: true,
  });
}

// Cart Mutations
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addToCartAPI(productId, quantity),
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemAPI(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      console.error("Failed to update cart item:", error);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItemAPI(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: (error) => {
      console.error("Failed to remove cart item:", error);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCartAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.setQueryData(queryKeys.cart, null);
    },
    onError: (error) => {
      console.error("Failed to clear cart:", error);
    },
  });
}

