import { Expense, Journey, Person } from '../types';
import { calculateJourneyBalance, getPersonExpensesSummary } from './calculations';

export interface ShareOptions {
  includeExpenses: boolean;
  includeBalances: boolean;
  includeSettlements: boolean;
  includeSummary: boolean;
}

// Category mapping for expenses
const getCategoryIcon = (category?: string): string => {
  const categoryMap: { [key: string]: string } = {
    'Food & Dining': '🍕',
    'Transportation': '🚗',
    'Accommodation': '🏨',
    'Entertainment': '🎟️',
    'Shopping': '🛍️',
    'Other': '📝',
    'General': '📝',
  };
  return categoryMap[category || 'General'] || '📝';
};

// Generate progress bar
const generateProgressBar = (percentage: number, width: number = 20): string => {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + ' '.repeat(empty);
};

export const formatDetailedJourneyReport = (
  journey: Journey,
  expenses: Expense[]
): string => {
  const balance = calculateJourneyBalance(expenses, journey.participants);
  const lines: string[] = [];
  
  // Header
  const headerLine = '='.repeat(60);
  lines.push(headerLine);
  lines.push(`JOURNEY EXPENSE REPORT: ${journey.name.toUpperCase()}`);
  lines.push(headerLine);
  
  // Trip Info
  lines.push(`Trip Name    : ${journey.name}`);
  lines.push(`Date         : ${new Date(journey.createdAt).toLocaleDateString()}`);
  lines.push(`Participants : ${journey.participants.map(p => p.name).join(', ')}`);
  lines.push(`Currency     : INR (₹)`);
  lines.push('-'.repeat(60));
  
  // [1] Financial Summary
  lines.push('[1] FINANCIAL SUMMARY');
  lines.push('-'.repeat(60));
  lines.push(`TOTAL TRIP COST    : ₹${balance.totalExpenses.toFixed(2)}`);
  lines.push(`COST PER PERSON    : ₹${(balance.totalExpenses / journey.participants.length).toFixed(2)}`);
  lines.push(`TOTAL TRANSACTIONS : ${expenses.length}`);
  lines.push('');
  
  // [2] Category Breakdown
  lines.push('[2] CATEGORY BREAKDOWN');
  lines.push('-'.repeat(60));
  
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach(expense => {
    const category = expense.category || 'General';
    categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
  });
  
  Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, amount]) => {
      const percentage = (amount / balance.totalExpenses) * 100;
      const icon = getCategoryIcon(category);
      const progressBar = generateProgressBar(percentage);
      const categoryName = category.toUpperCase().padEnd(8);
      lines.push(`${icon} ${categoryName} : ₹${amount.toFixed(2).padStart(8)}  [${progressBar}] ${percentage.toFixed(0)}%`);
    });
  lines.push('');
  
  // [3] Individual Ledger
  lines.push('[3] INDIVIDUAL LEDGER & ITEMIZED SPENDING');
  lines.push('-'.repeat(60));
  
  journey.participants.forEach((person, index) => {
    const summary = getPersonExpensesSummary(expenses, person.id);
    const personalBalance = balance.balances[person.id] || 0;
    const personalExpenses = expenses.filter(exp => exp.paidBy === person.id);
    
    // Person header with emoji
    const personEmoji = index === 0 ? '👤' : index === 1 ? '👩' : '👦';
    lines.push(`${personEmoji} ${person.name.toUpperCase()} (Payer ${String.fromCharCode(65 + index)})`);
    lines.push(`- Total Paid: ₹${summary.totalPaid.toFixed(2)}`);
    lines.push(`- Share: ₹${summary.totalShare.toFixed(2)} | Result: ${personalBalance < 0 ? '+' : ''}₹${Math.abs(personalBalance).toFixed(2)} (${personalBalance < 0 ? 'Get Back' : 'Owes'})`);
    lines.push('-'.repeat(55));
    
    // Personal expenses
    personalExpenses.forEach(expense => {
      const icon = getCategoryIcon(expense.category);
      const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      lines.push(`• ₹${expense.amount.toFixed(2).padStart(6)}  | ${date} | ${icon} ${expense.title}`);
    });
    lines.push('');
  });
  
  // [4] Settlement Plan
  lines.push('[4] SETTLEMENT PLAN (Who Pays Whom)');
  lines.push('-'.repeat(60));
  lines.push('To settle all debts in the most efficient way:');
  
  if (balance.settlements.length === 0) {
    lines.push('🎉 Everyone is already settled up!');
  } else {
    balance.settlements.forEach(settlement => {
      const fromName = getPersonName(settlement.from, journey.participants);
      const toName = getPersonName(settlement.to, journey.participants);
      const fromEmoji = getPersonEmoji(settlement.from, journey.participants);
      const toEmoji = getPersonEmoji(settlement.to, journey.participants);
      lines.push(`👉 ${fromEmoji} ${fromName.toUpperCase()}  pays  ${toEmoji} ${toName.toUpperCase()} : ₹${settlement.amount.toFixed(2)}`);
    });
  }
  lines.push('');
  
  // [5] One-to-One Transactions (Placeholder)
  lines.push('[5] ONE-TO-ONE TRANSACTIONS (P2P Log)');
  lines.push('-'.repeat(60));
  lines.push('DATE   | FROM  | TO    | AMOUNT | STATUS      | NOTE');
  lines.push('-------|-------|-------|--------|-------------|-------------');
  lines.push('       | (No direct transactions recorded)');
  lines.push('-'.repeat(60));
  lines.push('');
  
  // [6] Audit Log
  lines.push('[6] AUDIT LOG (Full Chronological History)');
  lines.push('-'.repeat(60));
  lines.push('ID   | DATE   | PAYER | CATEGORY  | AMOUNT | DESCRIPTION');
  lines.push('-----|--------|-------|-----------|--------|------------------');
  
  [...expenses]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((expense, index) => {
      const id = `#${(index + 1).toString().padStart(2, '0')}`;
      const date = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const payer = getPersonName(expense.paidBy, journey.participants);
      const category = (expense.category || 'General').padEnd(9);
      const amount = `₹${expense.amount.toFixed(0)}`.padEnd(6);
      const description = expense.title.length > 18 ? expense.title.substring(0, 15) + '...' : expense.title;
      
      lines.push(`${id}  | ${date.padEnd(6)} | ${payer.padEnd(5)} | ${category} | ${amount} | ${description}`);
    });
  
  // Footer
  lines.push(headerLine);
  lines.push('END OF REPORT - GENERATED BY SPLITZTER');
  lines.push(headerLine);
  
  return lines.join('\n');
};

const getPersonEmoji = (personId: string, participants: Person[]): string => {
  const index = participants.findIndex(p => p.id === personId);
  return index === 0 ? '👤' : index === 1 ? '👩' : '👦';
};

export const formatJourneyForSharing = (
  journey: Journey,
  expenses: Expense[],
  options: ShareOptions = {
    includeExpenses: true,
    includeBalances: true,
    includeSettlements: true,
    includeSummary: true,
  }
): string => {
  const balance = calculateJourneyBalance(expenses, journey.participants);
  const lines: string[] = [];

  // Header
  lines.push(`🎒 ${journey.name}`);
  if (journey.description) {
    lines.push(`📝 ${journey.description}`);
  }
  lines.push('');

  // Summary
  if (options.includeSummary) {
    lines.push('📊 SUMMARY');
    lines.push('─'.repeat(20));
    lines.push(`💰 Total Expenses: ₹${balance.totalExpenses.toFixed(2)}`);
    lines.push(`📋 Number of Expenses: ${expenses.length}`);
    lines.push(`👥 Participants: ${journey.participants.length}`);
    lines.push(`📅 Created: ${new Date(journey.createdAt).toLocaleDateString()}`);
    lines.push('');
  }

  // Expenses List
  if (options.includeExpenses && expenses.length > 0) {
    lines.push('💸 EXPENSES');
    lines.push('─'.repeat(20));
    
    expenses.forEach((expense, index) => {
      const paidByName = getPersonName(expense.paidBy, journey.participants);
      const splitNames = expense.splitBetween
        .map(id => getPersonName(id, journey.participants))
        .join(', ');
      
      lines.push(`${index + 1}. ${expense.title}`);
      lines.push(`   💵 ₹${expense.amount.toFixed(2)}`);
      lines.push(`   👤 Paid by: ${paidByName}`);
      lines.push(`   🔄 Split: ${splitNames}`);
      lines.push(`   📅 ${new Date(expense.date).toLocaleDateString()}`);
      if (expense.description) {
        lines.push(`   📝 ${expense.description}`);
      }
      lines.push('');
    });
  }

  // Individual Balances
  if (options.includeBalances) {
    lines.push('⚖️ BALANCES');
    lines.push('─'.repeat(20));
    
    journey.participants.forEach(person => {
      const summary = getPersonExpensesSummary(expenses, person.id);
      const balanceAmount = balance.balances[person.id] || 0;
      
      lines.push(`👤 ${person.name}`);
      lines.push(`   💳 Paid: ₹${summary.totalPaid.toFixed(2)}`);
      lines.push(`   🧾 Share: ₹${summary.totalShare.toFixed(2)}`);
      
      if (balanceAmount > 0.01) {
        lines.push(`   🔴 Owes: ₹${balanceAmount.toFixed(2)}`);
      } else if (balanceAmount < -0.01) {
        lines.push(`   🟢 Owed: ₹${Math.abs(balanceAmount).toFixed(2)}`);
      } else {
        lines.push(`   ✅ All settled`);
      }
      lines.push('');
    });
  }

  // Settlement Suggestions
  if (options.includeSettlements && balance.settlements.length > 0) {
    lines.push('💸 SUGGESTED PAYMENTS');
    lines.push('─'.repeat(20));
    
    balance.settlements.forEach((settlement, index) => {
      const fromName = getPersonName(settlement.from, journey.participants);
      const toName = getPersonName(settlement.to, journey.participants);
      lines.push(`${index + 1}. ${fromName} → ${toName}: ₹${settlement.amount.toFixed(2)}`);
    });
    lines.push('');
  }

  // Footer
  lines.push('📱 Generated by Splitzter');
  lines.push(`🕐 ${new Date().toLocaleString()}`);

  return lines.join('\n');
};

export const formatExpenseListForSharing = (
  journey: Journey,
  expenses: Expense[]
): string => {
  const lines: string[] = [];

  lines.push(`📋 ${journey.name} - Expense List`);
  lines.push('');

  if (expenses.length === 0) {
    lines.push('No expenses recorded yet.');
    return lines.join('\n');
  }

  expenses.forEach((expense, index) => {
    const paidByName = getPersonName(expense.paidBy, journey.participants);
    const splitAmount = expense.amount / expense.splitBetween.length;
    
    lines.push(`${index + 1}. ${expense.title} - ₹${expense.amount.toFixed(2)}`);
    lines.push(`   Paid by ${paidByName}`);
    lines.push(`   ₹${splitAmount.toFixed(2)} per person`);
    lines.push('');
  });

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  lines.push(`Total: ₹${totalAmount.toFixed(2)}`);

  return lines.join('\n');
};

export const formatSettlementsForSharing = (
  journey: Journey,
  expenses: Expense[]
): string => {
  const balance = calculateJourneyBalance(expenses, journey.participants);
  const lines: string[] = [];

  lines.push(`💰 ${journey.name} - Settlements`);
  lines.push('');

  if (balance.settlements.length === 0) {
    lines.push('🎉 Everyone is settled up!');
    return lines.join('\n');
  }

  lines.push('To settle all debts:');
  lines.push('');

  balance.settlements.forEach((settlement, index) => {
    const fromName = getPersonName(settlement.from, journey.participants);
    const toName = getPersonName(settlement.to, journey.participants);
    lines.push(`${index + 1}. ${fromName} pays ${toName} ₹${settlement.amount.toFixed(2)}`);
  });

  lines.push('');
  lines.push('After these payments, everyone will be even! ✅');

  return lines.join('\n');
};

export const formatPersonalSummaryForSharing = (
  journey: Journey,
  expenses: Expense[],
  personId: string
): string => {
  const person = journey.participants.find(p => p.id === personId);
  if (!person) return 'Person not found';

  const summary = getPersonExpensesSummary(expenses, personId);
  const balance = calculateJourneyBalance(expenses, journey.participants);
  const personalBalance = balance.balances[personId] || 0;

  const lines: string[] = [];

  lines.push(`👤 ${person.name}'s Summary`);
  lines.push(`🎒 Journey: ${journey.name}`);
  lines.push('');

  lines.push('💳 Your Payments:');
  const personalExpenses = expenses.filter(exp => exp.paidBy === personId);
  if (personalExpenses.length === 0) {
    lines.push('   No payments made');
  } else {
    personalExpenses.forEach(exp => {
      lines.push(`   • ${exp.title}: ₹${exp.amount.toFixed(2)}`);
    });
  }
  lines.push(`   Total Paid: ₹${summary.totalPaid.toFixed(2)}`);
  lines.push('');

  lines.push('🧾 Your Share:');
  lines.push(`   Total Share: ₹${summary.totalShare.toFixed(2)}`);
  lines.push('');

  lines.push('⚖️ Balance:');
  if (personalBalance > 0.01) {
    lines.push(`   🔴 You owe: ₹${personalBalance.toFixed(2)}`);
  } else if (personalBalance < -0.01) {
    lines.push(`   🟢 You are owed: ₹${Math.abs(personalBalance).toFixed(2)}`);
  } else {
    lines.push(`   ✅ You're all settled!`);
  }

  return lines.join('\n');
};

const getPersonName = (personId: string, participants: Person[]): string => {
  return participants.find(p => p.id === personId)?.name || 'Unknown';
};