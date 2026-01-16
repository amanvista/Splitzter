import { Expense, Journey, Person } from '@app-types';
import {
    createExpense as dbCreateExpense,
    createJourney as dbCreateJourney,
    deleteExpense as dbDeleteExpense,
    getJourneyById as dbGetJourneyById,
    getJourneyExpenses as dbGetJourneyExpenses,
    getJourneys as dbGetJourneys,
    updateExpense as dbUpdateExpense,
} from '@lib/database';
import { getCurrentUser, saveCurrentUser } from '@lib/user-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

// User thunks
export const loadCurrentUser = createAsyncThunk('user/loadCurrent', async () => {
  const user = await getCurrentUser();
  return user;
});

export const loginUser = createAsyncThunk('user/login', async (user: Person) => {
  await saveCurrentUser(user);
  return user;
});

// Journey thunks
export const loadJourneys = createAsyncThunk('journey/loadAll', async () => {
  const journeys = await dbGetJourneys();
  return journeys;
});

export const loadJourneyById = createAsyncThunk('journey/loadById', async (journeyId: string) => {
  const journey = await dbGetJourneyById(journeyId);
  return journey;
});

export const createJourney = createAsyncThunk('journey/create', async (journey: Journey) => {
  await dbCreateJourney(journey);
  return journey;
});

// Note: These thunks are commented out as the corresponding database functions
// are not implemented. The app currently works without Redux state management.

// export const updateJourneyData = createAsyncThunk(
//   'journey/update',
//   async (journey: Journey) => {
//     await dbUpdateJourney(journey);
//     return journey;
//   }
// );

// export const addParticipant = createAsyncThunk(
//   'journey/addParticipant',
//   async ({ journeyId, participant }: { journeyId: string; participant: Person }) => {
//     await dbAddParticipant(journeyId, participant);
//     const updatedJourney = await dbGetJourneyById(journeyId);
//     return updatedJourney;
//   }
// );

// Expense thunks
export const loadExpensesForJourney = createAsyncThunk(
  'expense/loadForJourney',
  async (journeyId: string) => {
    const expenses = await dbGetJourneyExpenses(journeyId);
    return { journeyId, expenses };
  }
);

export const createExpenseThunk = createAsyncThunk(
  'expense/create',
  async (expense: Expense) => {
    await dbCreateExpense(expense);
    return expense;
  }
);

export const updateExpenseThunk = createAsyncThunk(
  'expense/update',
  async (expense: Expense) => {
    await dbUpdateExpense(expense);
    return expense;
  }
);

export const deleteExpenseThunk = createAsyncThunk(
  'expense/delete',
  async ({ journeyId, expenseId }: { journeyId: string; expenseId: string }) => {
    await dbDeleteExpense(expenseId);
    return { journeyId, expenseId };
  }
);
