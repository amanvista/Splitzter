import { Platform } from 'react-native';

// Platform-specific database imports
let dbModule: any = null;

const getDBModule = async () => {
  if (!dbModule) {
    if (Platform.OS === 'web') {
      dbModule = await import('./database.web');
    } else {
      dbModule = await import('./database-native');
    }
  }
  return dbModule;
};

// Initialize database
export const initDatabase = async () => {
  const db = await getDBModule();
  return db.initDatabase();
};

// Journey operations
export const createJourney = async (journey: any): Promise<void> => {
  const db = await getDBModule();
  return db.createJourney(journey);
};

export const getJourneys = async (): Promise<any[]> => {
  const db = await getDBModule();
  return db.getJourneys();
};

export const getJourneyById = async (id: string): Promise<any> => {
  const db = await getDBModule();
  return db.getJourneyById(id);
};

// Person operations
export const savePerson = async (person: any): Promise<void> => {
  const db = await getDBModule();
  return db.savePerson(person);
};

export const getJourneyParticipants = async (journeyId: string): Promise<any[]> => {
  const db = await getDBModule();
  return db.getJourneyParticipants(journeyId);
};

// Expense operations
export const createExpense = async (expense: any): Promise<void> => {
  const db = await getDBModule();
  return db.createExpense(expense);
};

export const updateExpense = async (expense: any): Promise<void> => {
  const db = await getDBModule();
  return db.updateExpense(expense);
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  const db = await getDBModule();
  return db.deleteExpense(expenseId);
};

export const getJourneyExpenses = async (journeyId: string): Promise<any[]> => {
  const db = await getDBModule();
  return db.getJourneyExpenses(journeyId);
};