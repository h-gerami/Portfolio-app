import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCartAPI,
  clearCartAPI,
  fetchCart,
  fetchProductById,
  fetchProducts,
  removeCartItemAPI,
  updateCartItemAPI,
  CartItemResponse,
} from "./api";
import { PetProduct } from "./types";
import { useCartStore } from "@/src/store/useCartStore";

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

// Cart Mutations with Optimistic Updates
export function useAddToCart() {
  const queryClient = useQueryClient();
  const addToCart = useCartStore((state) => state.addToCart);
  const syncCartItem = useCartStore((state) => state.syncCartItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return useMutation({
    mutationFn: ({ productId, quantity, product }: { productId: string; quantity: number; product: PetProduct }) =>
      addToCartAPI(productId, quantity),
    onMutate: async ({ productId, quantity, product }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot previous value
      const previousCart = useCartStore.getState().items;

      // Optimistically update local state
      addToCart(product, quantity);

      // Return context with snapshot
      return { previousCart, productId };
    },
    onSuccess: (data, variables) => {
      // Update with backend response ID
      if (data?.id) {
        syncCartItem(variables.productId, data.id);
      }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        useCartStore.setState({ items: context.previousCart });
      } else {
        removeFromCart(variables.productId);
      }
      console.error("Failed to add to cart:", error);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return useMutation({
    mutationFn: ({ itemId, quantity, productId }: { itemId: string; quantity: number; productId: string }) =>
      updateCartItemAPI(itemId, quantity),
    onMutate: async ({ quantity, productId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot previous value (state may already be updated optimistically)
      const previousCart = useCartStore.getState().items;
      const previousItem = previousCart.find((item) => item.product.id === productId);
      const previousQuantity = previousItem?.quantity || 0;

      // If state doesn't match expected quantity, update it (for consistency)
      const currentItem = previousCart.find((item) => item.product.id === productId);
      if (currentItem && currentItem.quantity !== quantity) {
        updateQuantity(productId, quantity);
      }

      // Return context with snapshot
      return { previousCart, productId, previousQuantity };
    },
    onSuccess: () => {
      // Success - optimistic update already done
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        useCartStore.setState({ items: context.previousCart });
      } else if (context?.previousQuantity !== undefined) {
        updateQuantity(context.productId, context.previousQuantity);
      }
      console.error("Failed to update cart item:", error);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);

  return useMutation({
    mutationFn: ({ itemId, productId }: { itemId: string; productId: string }) => removeCartItemAPI(itemId),
    onMutate: async ({ productId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot previous value
      const previousCart = useCartStore.getState().items;
      const previousItem = previousCart.find((item) => item.product.id === productId);

      // Optimistically remove from local state
      removeFromCart(productId);

      // Return context with snapshot
      return { previousCart, previousItem };
    },
    onSuccess: () => {
      // Success - no need to invalidate, optimistic update already done
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        useCartStore.setState({ items: context.previousCart });
      } else if (context?.previousItem) {
        addToCart(context.previousItem.product, context.previousItem.quantity, context.previousItem.id);
      }
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

