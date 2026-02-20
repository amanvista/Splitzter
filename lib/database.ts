import { Platform } from 'react-native';

// Platform-specific database imports
let dbModule: any = null;
let forceWebStorage = false;

const getDBModule = async () => {
  if (!dbModule) {
    if (Platform.OS === 'web' || forceWebStorage) {
      console.log('Using web storage database');
      dbModule = await import('./database.web');
    } else {
      try {
        console.log('Attempting to use native SQLite database');
        dbModule = await import('./database-native');
        // Test if native database works
        await dbModule.initDatabase();
      } catch (error) {
        console.error('Native database failed, switching to web storage:', error);
        forceWebStorage = true;
        dbModule = await import('./database.web');
      }
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

export const updateJourney = async (journey: any): Promise<void> => {
  const db = await getDBModule();
  return db.updateJourney(journey);
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

export const addParticipantToJourney = async (journeyId: string, participant: any): Promise<void> => {
  const db = await getDBModule();
  return db.addParticipantToJourney(journeyId, participant);
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