import { Table } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
  tables: Table[];
  isLoading: boolean;
}

const initialState: TableState = {
  tables: [],
  isLoading: false,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },
    updateTableStatus: (state, action: PayloadAction<{ id: string; status: Table['status'] }>) => {
      const table = state.tables.find(t => t.id === action.payload.id);
      if (table) {
        table.status = action.payload.status;
      }
    },
    assignOrderToTable: (state, action: PayloadAction<{ tableId: string; orderId: string }>) => {
      const table = state.tables.find(t => t.id === action.payload.tableId);
      if (table) {
        table.currentOrderId = action.payload.orderId;
        table.status = 'occupied';
      }
    },
    clearTableOrder: (state, action: PayloadAction<string>) => {
      const table = state.tables.find(t => t.id === action.payload);
      if (table) {
        table.currentOrderId = undefined;
        table.status = 'available';
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTables, updateTableStatus, assignOrderToTable, clearTableOrder, setLoading } = tableSlice.actions;
export default tableSlice.reducer;
