import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types';
import { couponsService } from '@/lib/supabaseServices';

export const FREE_SHIPPING_THRESHOLD = 200;
export const STANDARD_SHIPPING_FEE = 25;
export const VAT_RATE = 0.15;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  couponDiscountPercentage: number;
  couponFixedDiscount: number;
  couponError: string | null;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    quantity?: number,
    variants?: { color?: string; size?: string; volume?: string; priceModifier?: number }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;

  // Calculated values
  getSubtotal: () => number;
  getDiscount: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getFreeShippingRemaining: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      couponDiscountPercentage: 0,
      couponFixedDiscount: 0,
      couponError: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, variants) => {
        set((state) => {
          const variantKey = `${variants?.color || ''}_${variants?.size || ''}_${variants?.volume || ''}`;
          const itemId = `${product.id}_${variantKey}`;
          const unitPrice = product.price + (variants?.priceModifier || 0);

          const existingIndex = state.items.findIndex((item) => item.id === itemId);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          }

          const newItem: CartItem = {
            id: itemId,
            product,
            quantity,
            selectedColor: variants?.color,
            selectedSize: variants?.size,
            selectedVolume: variants?.volume,
            unitPrice,
          };

          return {
            items: [...state.items, newItem],
            isOpen: true,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscountPercentage: 0, couponFixedDiscount: 0, couponError: null });
      },

      applyCoupon: async (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        
        try {
          const coupon = await couponsService.validate(cleanCode);

          const subtotal = get().getSubtotal();
          if (coupon.minSpend && subtotal < coupon.minSpend) {
            set({ couponError: 'min_spend' });
            return { success: false, error: 'min_spend' };
          }

          if (coupon.discountType === 'percentage') {
            set({
              couponCode: coupon.code,
              couponDiscountPercentage: coupon.discountValue,
              couponFixedDiscount: 0,
              couponError: null,
            });
          } else {
            set({
              couponCode: coupon.code,
              couponDiscountPercentage: 0,
              couponFixedDiscount: coupon.discountValue,
              couponError: null,
            });
          }

          return { success: true };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Invalid coupon code';
          set({ couponError: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscountPercentage: 0, couponFixedDiscount: 0, couponError: null });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const { couponDiscountPercentage, couponFixedDiscount } = get();

        if (couponDiscountPercentage > 0) {
          return (subtotal * couponDiscountPercentage) / 100;
        }
        if (couponFixedDiscount > 0) {
          return Math.min(couponFixedDiscount, subtotal);
        }
        return 0;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxableAmount = Math.max(0, subtotal - discount);
        return taxableAmount * VAT_RATE;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const tax = get().getTax();
        const shipping = get().getShipping();
        return Math.max(0, subtotal - discount + tax + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getFreeShippingRemaining: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      },
    }),
    {
      name: 'hakim_store_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscountPercentage: state.couponDiscountPercentage,
        couponFixedDiscount: state.couponFixedDiscount,
      }),
    }
  )
);
