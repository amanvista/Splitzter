import { Expense, Journey, Person } from '../types';
import {
    createExpenseWeb,
    createJourneyWeb,
    deleteExpenseWeb,
    getJourneyByIdWeb,
    getJourneyExpensesWeb,
    getJourneysWeb,
    initWebStorage,
    updateExpenseWeb,
} from './storage-web';

// Initialize database
export const initDatabase = async () => {
  initWebStorage();
};

// Journey operations
export const createJourney = (journey: Journey): void => {
  createJourneyWeb(journey);
};

export const getJourneys = (): Promise<Journey[]> => {
  return getJourneysWeb();
};

export const getJourneyById = (id: string): Promise<Journey | null> => {
  return getJourneyByIdWeb(id);
};

// Person operations
export const savePerson = (person: Person): void => {
  // Web storage handles this in createJourneyWeb
};

export const getJourneyParticipants = (journeyId: string): Promise<Person[]> => {
  // This is handled in the web storage functions
  return Promise.resolve([]);
};

// Expense operations
export const createExpense = (expense: Expense): void => {
  createExpenseWeb(expense);
};

export const updateExpense = (expense: Expense): void => {
  updateExpenseWeb(expense);
};

export const deleteExpense = (expenseId: string): void => {
  deleteExpenseWeb(expenseId);
};

export const getJourneyExpenses = (journeyId: string): Promise<Expense[]> => {
  return getJourneyExpensesWeb(journeyId);
};