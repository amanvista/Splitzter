import { Expense, Journey, Settlement } from '../types';

export const createSettlementExpense = (
  settlement: Settlement,
  journey: Journey,
  description: string = 'Settlement payment'
): Expense => {
  return {
    id: `settlement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    journeyId: journey.id,
    title: `Settlement: ${description}`,
    amount: settlement.amount,
    paidBy: settlement.from, // Person who owes money pays
    splitBetween: [settlement.to], // Only the person who is owed gets the benefit
    category: 'Settlement',
    date: new Date().toISOString(),
    description: `Settlement payment from ${getPersonName(settlement.from, journey.participants)} to ${getPersonName(settlement.to, journey.participants)}`,
  };
};

export const createAllSettlementExpenses = (
  settlements: Settlement[],
  journey: Journey
): Expense[] => {
  return settlements.map((settlement, index) => 
    createSettlementExpense(
      settlement,
      journey,
      `Payment ${index + 1} of ${settlements.length}`
    )
  );
};

const getPersonName = (personId: string, participants: any[]): string => {
  return participants.find(p => p.id === personId)?.name || 'Unknown';
};

export const confirmSettlement = (
  settlement: Settlement,
  fromPersonName: string,
  toPersonName: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    // This would typically show a confirmation dialog
    // For now, we'll assume confirmation
    resolve(true);
  });
};

export const confirmSettleAll = (
  settlements: Settlement[],
  getPersonName: (id: string) => string
): Promise<boolean> => {
  return new Promise((resolve) => {
    // This would typically show a confirmation dialog with all settlements
    // For now, we'll assume confirmation
    resolve(true);
  });
};