import { Expense, Journey, Person } from '../types';

// In-memory storage for web platform
let journeys: Journey[] = [];
let people: Person[] = [];
let expenses: Expense[] = [];
let journeyParticipants: { journeyId: string; personId: string }[] = [];
let expenseSplits: { expenseId: string; personId: string }[] = [];

export const initWebStorage = () => {
  // Load from localStorage if available
  try {
    const storedJourneys = localStorage.getItem('splitzter_journeys');
    const storedPeople = localStorage.getItem('splitzter_people');
    const storedExpenses = localStorage.getItem('splitzter_expenses');
    const storedParticipants = localStorage.getItem('splitzter_participants');
    const storedSplits = localStorage.getItem('splitzter_splits');

    if (storedJourneys) journeys = JSON.parse(storedJourneys);
    if (storedPeople) people = JSON.parse(storedPeople);
    if (storedExpenses) expenses = JSON.parse(storedExpenses);
    if (storedParticipants) journeyParticipants = JSON.parse(storedParticipants);
    if (storedSplits) expenseSplits = JSON.parse(storedSplits);
  } catch (error) {
    console.log('No stored data found or error loading:', error);
  }
};

const saveToStorage = () => {
  try {
    localStorage.setItem('splitzter_journeys', JSON.stringify(journeys));
    localStorage.setItem('splitzter_people', JSON.stringify(people));
    localStorage.setItem('splitzter_expenses', JSON.stringify(expenses));
    localStorage.setItem('splitzter_participants', JSON.stringify(journeyParticipants));
    localStorage.setItem('splitzter_splits', JSON.stringify(expenseSplits));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Journey operations
export const createJourneyWeb = (journey: Journey): void => {
  journeys.push(journey);
  
  // Add participants
  journey.participants.forEach(person => {
    savePersonWeb(person);
    addParticipantToJourneyWeb(journey.id, person);
  });
  
  saveToStorage();
};

export const getJourneysWeb = (): Promise<Journey[]> => {
  return Promise.resolve(
    journeys
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(journey => ({
        ...journey,
        participants: getJourneyParticipantsWeb(journey.id)
      }))
  );
};

export const getJourneyByIdWeb = (id: string): Promise<Journey | null> => {
  const journey = journeys.find(j => j.id === id);
  if (!journey) return Promise.resolve(null);
  
  return Promise.resolve({
    ...journey,
    participants: getJourneyParticipantsWeb(journey.id)
  });
};

export const updateJourneyWeb = (journey: Journey): void => {
  const existingIndex = journeys.findIndex(j => j.id === journey.id);
  if (existingIndex >= 0) {
    journeys[existingIndex] = journey;
    saveToStorage();
  }
};

// Person operations
export const savePersonWeb = (person: Person): void => {
  const existingIndex = people.findIndex(p => p.id === person.id);
  if (existingIndex >= 0) {
    people[existingIndex] = person;
  } else {
    people.push(person);
  }
  saveToStorage();
};

export const getJourneyParticipantsWeb = (journeyId: string): Person[] => {
  const participantIds = journeyParticipants
    .filter(jp => jp.journeyId === journeyId)
    .map(jp => jp.personId);
  
  return people.filter(p => participantIds.includes(p.id));
};

export const addParticipantToJourneyWeb = (journeyId: string, participant: Person): void => {
  // First save the person if they don't exist
  const existingPerson = people.find(p => p.id === participant.id);
  if (!existingPerson) {
    people.push(participant);
  }
  
  // Then add them to the journey if not already added
  const exists = journeyParticipants.some(jp => jp.journeyId === journeyId && jp.personId === participant.id);
  if (!exists) {
    journeyParticipants.push({ journeyId, personId: participant.id });
  }
  
  saveToStorage();
};

// Expense operations
export const createExpenseWeb = (expense: Expense): void => {
  expenses.push(expense);
  
  // Add splits
  expense.splitBetween.forEach(personId => {
    expenseSplits.push({ expenseId: expense.id, personId });
  });
  
  saveToStorage();
};

export const updateExpenseWeb = (expense: Expense): void => {
  const existingIndex = expenses.findIndex(e => e.id === expense.id);
  if (existingIndex >= 0) {
    expenses[existingIndex] = expense;
    
    // Remove old splits
    expenseSplits = expenseSplits.filter(es => es.expenseId !== expense.id);
    
    // Add new splits
    expense.splitBetween.forEach(personId => {
      expenseSplits.push({ expenseId: expense.id, personId });
    });
    
    saveToStorage();
  }
};

export const deleteExpenseWeb = (expenseId: string): void => {
  expenses = expenses.filter(e => e.id !== expenseId);
  expenseSplits = expenseSplits.filter(es => es.expenseId !== expenseId);
  saveToStorage();
};

export const getJourneyExpensesWeb = (journeyId: string): Promise<Expense[]> => {
  const journeyExpenses = expenses
    .filter(e => e.journeyId === journeyId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(expense => ({
      ...expense,
      splitBetween: getExpenseSplitsWeb(expense.id)
    }));
  
  return Promise.resolve(journeyExpenses);
};

const getExpenseSplitsWeb = (expenseId: string): string[] => {
  return expenseSplits
    .filter(es => es.expenseId === expenseId)
    .map(es => es.personId);
};