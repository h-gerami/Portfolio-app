import { create } from "zustand";
import { PetProduct } from "@/src/features/store/types";
import { CartItemResponse } from "@/src/features/store/api";

export type CartItem = {
  id?: string; // Backend cart item ID
  product: PetProduct;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (product: PetProduct, quantity?: number, itemId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  syncCartItem: (productId: string, itemId: string) => void;
  syncCartFromBackend: (backendItems: CartItemResponse[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product, quantity = 1, itemId) => {
    const currentItems = get().items;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      // Update quantity if product already in cart
      set({
        items: currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, id: itemId || item.id }
            : item
        ),
      });
    } else {
      // Add new item to cart
      set({
        items: [...currentItems, { product, quantity, id: itemId }],
      });
    }
  },

  removeFromCart: (productId) => {
    set({
      items: get().items.filter((item) => item.product.id !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  isInCart: (productId) => {
    return get().items.some((item) => item.product.id === productId);
  },

  syncCartItem: (productId, itemId) => {
    set({
      items: get().items.map((item) =>
        item.product.id === productId ? { ...item, id: itemId } : item
      ),
    });
  },

  syncCartFromBackend: (backendItems) => {
    const syncedItems: CartItem[] = backendItems.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
    }));
    set({ items: syncedItems });
  },
}));

