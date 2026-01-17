import * as SQLite from 'expo-sqlite';
import { Expense, Journey, Person } from '../types';

let db: SQLite.SQLiteDatabase;

// Initialize database
const initDB = () => {
  // Use openDatabaseSync instead of openDatabase
  db = SQLite.openDatabaseSync('splitzter.db');
};

export const initDatabase = async () => {
  try {
    initDB();
    
    // Use execAsync for better performance and modern API
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS journeys (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS people (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        is_from_contacts INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS journey_participants (
        journey_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        PRIMARY KEY (journey_id, person_id),
        FOREIGN KEY (journey_id) REFERENCES journeys (id),
        FOREIGN KEY (person_id) REFERENCES people (id)
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        journey_id TEXT NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        paid_by TEXT NOT NULL,
        category TEXT,
        date TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (journey_id) REFERENCES journeys (id),
        FOREIGN KEY (paid_by) REFERENCES people (id)
      );

      CREATE TABLE IF NOT EXISTS expense_splits (
        expense_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        PRIMARY KEY (expense_id, person_id),
        FOREIGN KEY (expense_id) REFERENCES expenses (id),
        FOREIGN KEY (person_id) REFERENCES people (id)
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Journey operations
export const createJourney = async (journey: Journey): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT INTO journeys (id, name, description, created_at) VALUES (?, ?, ?, ?)',
      [journey.id, journey.name, journey.description || '', journey.createdAt]
    );
    
    // Add participants
    for (const person of journey.participants) {
      await savePerson(person);
      await addParticipantToJourneyById(journey.id, person.id);
    }
  } catch (error) {
    console.error('Error creating journey:', error);
    throw error;
  }
};

export const getJourneys = async (): Promise<Journey[]> => {
  try {
    const result = await db.getAllAsync('SELECT * FROM journeys ORDER BY created_at DESC');
    const journeys: Journey[] = [];
    
    for (const row of result as any[]) {
      const participants = await getJourneyParticipants(row.id);
      journeys.push({
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        participants
      });
    }
    
    return journeys;
  } catch (error) {
    console.error('Error getting journeys:', error);
    throw error;
  }
};

export const getJourneyById = async (id: string): Promise<Journey | null> => {
  try {
    const result = await db.getFirstAsync('SELECT * FROM journeys WHERE id = ?', [id]);
    
    if (!result) {
      return null;
    }
    
    const journey = result as any;
    const participants = await getJourneyParticipants(journey.id);
    
    return {
      id: journey.id,
      name: journey.name,
      description: journey.description,
      createdAt: journey.created_at,
      participants
    };
  } catch (error) {
    console.error('Error getting journey by id:', error);
    throw error;
  }
};

// Person operations
export const savePerson = async (person: Person): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO people (id, name, phone, email, is_from_contacts) VALUES (?, ?, ?, ?, ?)',
      [person.id, person.name, person.phone || '', person.email || '', person.isFromContacts ? 1 : 0]
    );
  } catch (error) {
    console.error('Error saving person:', error);
    throw error;
  }
};

export const getJourneyParticipants = async (journeyId: string): Promise<Person[]> => {
  try {
    const result = await db.getAllAsync(
      `SELECT p.* FROM people p
       JOIN journey_participants jp ON p.id = jp.person_id
       WHERE jp.journey_id = ?`,
      [journeyId]
    );
    
    return (result as any[]).map(p => ({
      id: p.id,
      name: p.name,
      phone: p.phone,
      email: p.email,
      isFromContacts: p.is_from_contacts === 1
    }));
  } catch (error) {
    console.error('Error getting journey participants:', error);
    throw error;
  }
};

export const addParticipantToJourney = async (journeyId: string, participant: Person): Promise<void> => {
  try {
    // First save the person if they don't exist
    await savePerson(participant);
    
    // Then add them to the journey
    await db.runAsync(
      'INSERT OR IGNORE INTO journey_participants (journey_id, person_id) VALUES (?, ?)',
      [journeyId, participant.id]
    );
  } catch (error) {
    console.error('Error adding participant to journey:', error);
    throw error;
  }
};

// Helper function for internal use
const addParticipantToJourneyById = async (journeyId: string, personId: string): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT OR IGNORE INTO journey_participants (journey_id, person_id) VALUES (?, ?)',
      [journeyId, personId]
    );
  } catch (error) {
    console.error('Error adding participant to journey:', error);
    throw error;
  }
};

// Expense operations
export const createExpense = async (expense: Expense): Promise<void> => {
  try {
    await db.runAsync(
      'INSERT INTO expenses (id, journey_id, title, amount, paid_by, category, date, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [expense.id, expense.journeyId, expense.title, expense.amount, expense.paidBy, expense.category || '', expense.date, expense.description || '']
    );
    
    // Add splits
    for (const personId of expense.splitBetween) {
      await db.runAsync(
        'INSERT INTO expense_splits (expense_id, person_id) VALUES (?, ?)',
        [expense.id, personId]
      );
    }
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const updateExpense = async (expense: Expense): Promise<void> => {
  try {
    // Update expense
    await db.runAsync(
      'UPDATE expenses SET title = ?, amount = ?, paid_by = ?, category = ?, description = ? WHERE id = ?',
      [expense.title, expense.amount, expense.paidBy, expense.category || '', expense.description || '', expense.id]
    );
    
    // Delete old splits
    await db.runAsync('DELETE FROM expense_splits WHERE expense_id = ?', [expense.id]);
    
    // Add new splits
    for (const personId of expense.splitBetween) {
      await db.runAsync(
        'INSERT INTO expense_splits (expense_id, person_id) VALUES (?, ?)',
        [expense.id, personId]
      );
    }
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM expense_splits WHERE expense_id = ?', [expenseId]);
    await db.runAsync('DELETE FROM expenses WHERE id = ?', [expenseId]);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const getJourneyExpenses = async (journeyId: string): Promise<Expense[]> => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM expenses WHERE journey_id = ? ORDER BY date DESC',
      [journeyId]
    );
    
    const expenses: Expense[] = [];
    for (const row of result as any[]) {
      const splitBetween = await getExpenseSplits(row.id);
      
      expenses.push({
        id: row.id,
        journeyId: row.journey_id,
        title: row.title,
        amount: row.amount,
        paidBy: row.paid_by,
        category: row.category,
        date: row.date,
        description: row.description,
        splitBetween
      });
    }
    
    return expenses;
  } catch (error) {
    console.error('Error getting journey expenses:', error);
    throw error;
  }
};

const getExpenseSplits = async (expenseId: string): Promise<string[]> => {
  try {
    const result = await db.getAllAsync(
      'SELECT person_id FROM expense_splits WHERE expense_id = ?',
      [expenseId]
    );
    
    return (result as any[]).map(row => row.person_id);
  } catch (error) {
    console.error('Error getting expense splits:', error);
    throw error;
  }
};