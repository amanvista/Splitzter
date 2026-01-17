import { Expense, Person } from '../types';

export const formatExpenseActivity = (
  expense: Expense,
  participants: Person[],
  getPersonName: (personId: string) => string
): string => {
  const paidByName = getPersonName(expense.paidBy);
  const splitCount = expense.splitBetween.length;
  const totalParticipants = participants.length;
  
  // Determine split description
  let splitDescription: string;
  
  if (splitCount === totalParticipants) {
    splitDescription = 'everyone';
  } else if (splitCount === 1) {
    const splitPersonName = getPersonName(expense.splitBetween[0]);
    if (expense.splitBetween[0] === expense.paidBy) {
      splitDescription = 'themselves';
    } else {
      splitDescription = splitPersonName;
    }
  } else if (splitCount === 2) {
    const names = expense.splitBetween.map(id => getPersonName(id));
    splitDescription = names.join(' and ');
  } else {
    splitDescription = `${splitCount} people`;
  }
  
  // Format the activity text
  const amount = `₹${expense.amount.toLocaleString()}`;
  const expenseTitle = expense.title.toLowerCase();
  
  return `${paidByName} paid ${amount} for ${splitDescription} for ${expenseTitle}`;
};

export const formatExpenseActivityShort = (
  expense: Expense,
  getPersonName: (personId: string) => string
): string => {
  const paidByName = getPersonName(expense.paidBy);
  const amount = `₹${expense.amount.toLocaleString()}`;
  
  return `${paidByName} • ${amount}`;
};