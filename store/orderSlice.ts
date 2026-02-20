import { Order } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
}

const initialState: OrderState = {
  orders: [],
  isLoading: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setOrders, addOrder, updateOrderStatus, updateOrder, deleteOrder, setLoading } = orderSlice.actions;
export default orderSlice.reducer;
