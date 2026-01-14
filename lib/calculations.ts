import { Expense, JourneyBalance, Person, Settlement } from '../types';

export const calculateJourneyBalance = (expenses: Expense[], participants: Person[]): JourneyBalance => {
  const balances: { [personId: string]: number } = {};
  let totalExpenses = 0;

  // Initialize balances
  participants.forEach(person => {
    balances[person.id] = 0;
  });

  // Calculate balances for each expense
  expenses.forEach(expense => {
    totalExpenses += expense.amount;
    const splitAmount = expense.amount / expense.splitBetween.length;

    // Person who paid gets credited
    balances[expense.paidBy] -= expense.amount;

    // Each person in split gets debited their share
    expense.splitBetween.forEach(personId => {
      balances[personId] += splitAmount;
    });
  });

  // Calculate settlements using simplified debt resolution
  const settlements = calculateSettlements(balances, participants);

  return {
    journeyId: expenses[0]?.journeyId || '',
    totalExpenses,
    balances,
    settlements
  };
};

const calculateSettlements = (balances: { [personId: string]: number }, participants: Person[]): Settlement[] => {
  const settlements: Settlement[] = [];
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  // Separate creditors (negative balance - owed money) and debtors (positive balance - owes money)
  Object.entries(balances).forEach(([personId, balance]) => {
    if (balance > 0.01) { // owes money
      debtors.push({ id: personId, amount: balance });
    } else if (balance < -0.01) { // owed money
      creditors.push({ id: personId, amount: -balance });
    }
  });

  // Sort by amount for optimal settlement
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const settlementAmount = Math.min(creditor.amount, debtor.amount);
    
    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(settlementAmount * 100) / 100 // Round to 2 decimal places
      });
    }

    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
};

export const getPersonExpensesSummary = (expenses: Expense[], personId: string) => {
  let totalPaid = 0;
  let totalShare = 0;

  expenses.forEach(expense => {
    if (expense.paidBy === personId) {
      totalPaid += expense.amount;
    }
    if (expense.splitBetween.includes(personId)) {
      totalShare += expense.amount / expense.splitBetween.length;
    }
  });

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalShare: Math.round(totalShare * 100) / 100,
    balance: Math.round((totalShare - totalPaid) * 100) / 100
  };
};