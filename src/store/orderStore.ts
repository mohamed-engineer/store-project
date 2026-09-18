import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order } from '@/types';
import { ordersService } from '@/lib/supabaseServices';

interface OrderState {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  fetchOrder: (orderId: string) => Promise<Order>;
  fetchOrderByNumber: (orderNumber: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: string, note?: { en: string; ar: string }) => Promise<Order>;
  updateOrderTracking: (orderId: string, trackingNumber: string) => Promise<Order>;
  setCurrentOrder: (order: Order | null) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      createOrder: async (order) => {
        set({ isLoading: true, error: null });
        try {
          const newOrder = await ordersService.create(order);
          set((state) => ({
            orders: [...state.orders, newOrder],
            currentOrder: newOrder,
            isLoading: false,
          }));
          return newOrder;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg, isLoading: false });
          throw error;
        }
      },

      fetchOrder: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const order = await ordersService.fetchById(orderId);
          set({ currentOrder: order, isLoading: false });
          return order;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg, isLoading: false });
          throw error;
        }
      },

      fetchOrderByNumber: async (orderNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          const order = await ordersService.fetchByOrderNumber(orderNumber);
          set({ currentOrder: order, isLoading: false });
          return order;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg, isLoading: false });
          throw error;
        }
      },

      updateOrderStatus: async (orderId: string, status: string, note) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrder = await ordersService.updateStatus(orderId, status, note);
          set((state) => ({
            orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
            currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
            isLoading: false,
          }));
          return updatedOrder;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg, isLoading: false });
          throw error;
        }
      },

      updateOrderTracking: async (orderId: string, trackingNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrder = await ordersService.updateTracking(orderId, trackingNumber);
          set((state) => ({
            orders: state.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
            currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
            isLoading: false,
          }));
          return updatedOrder;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg, isLoading: false });
          throw error;
        }
      },

      setCurrentOrder: (order: Order | null) => {
        set({ currentOrder: order });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'order-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentOrder: state.currentOrder,
      }),
    }
  )
);
