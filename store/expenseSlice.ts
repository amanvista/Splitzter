import { Expense } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    createExpenseThunk,
    deleteExpenseThunk,
    loadExpensesForJourney,
    updateExpenseThunk,
} from './thunks';

interface ExpenseState {
  expenses: { [journeyId: string]: Expense[] };
  isLoading: boolean;
}

const initialState: ExpenseState = {
  expenses: {},
  isLoading: false,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpensesForJourney: (state, action: PayloadAction<{ journeyId: string; expenses: Expense[] }>) => {
      state.expenses[action.payload.journeyId] = action.payload.expenses;
    },
    clearExpensesForJourney: (state, action: PayloadAction<string>) => {
      delete state.expenses[action.payload];
    },
    setExpenseLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load expenses for journey
      .addCase(loadExpensesForJourney.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadExpensesForJourney.fulfilled, (state, action) => {
        state.expenses[action.payload.journeyId] = action.payload.expenses;
        state.isLoading = false;
      })
      .addCase(loadExpensesForJourney.rejected, (state) => {
        state.isLoading = false;
      })
      // Create expense
      .addCase(createExpenseThunk.fulfilled, (state, action) => {
        const journeyId = action.payload.journeyId;
        if (!state.expenses[journeyId]) {
          state.expenses[journeyId] = [];
        }
        state.expenses[journeyId].unshift(action.payload);
      })
      // Update expense
      .addCase(updateExpenseThunk.fulfilled, (state, action) => {
        const journeyId = action.payload.journeyId;
        if (state.expenses[journeyId]) {
          const index = state.expenses[journeyId].findIndex(e => e.id === action.payload.id);
          if (index !== -1) {
            state.expenses[journeyId][index] = action.payload;
          }
        }
      })
      // Delete expense
      .addCase(deleteExpenseThunk.fulfilled, (state, action) => {
        const { journeyId, expenseId } = action.payload;
        if (state.expenses[journeyId]) {
          state.expenses[journeyId] = state.expenses[journeyId].filter(e => e.id !== expenseId);
        }
      });
  },
});

export const {
  setExpensesForJourney,
  clearExpensesForJourney,
  setExpenseLoading,
} = expenseSlice.actions;

export default expenseSlice.reducer;
