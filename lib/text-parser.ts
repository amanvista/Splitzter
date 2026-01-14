import { Person } from '../types';

export interface ParsedExpense {
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  description?: string;
}

export interface ParseResult {
  expenses: ParsedExpense[];
  errors: string[];
}

// Parse text like "I owe amit 10 rs" or "amit owes me 30 rs"
export const parseExpenseText = (text: string, participants: Person[]): ParseResult => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const expenses: ParsedExpense[] = [];
  const errors: string[] = [];

  // Create a map for easy name lookup (case insensitive)
  const nameMap = new Map<string, Person>();
  participants.forEach(person => {
    nameMap.set(person.name.toLowerCase(), person);
  });

  // Add "me" as a special case - we'll need to handle this in the UI
  const meId = 'current_user';

  lines.forEach((line, index) => {
    try {
      const parsed = parseExpenseLine(line.trim(), nameMap, meId);
      if (parsed) {
        expenses.push(parsed);
      } else {
        errors.push(`Line ${index + 1}: Could not parse "${line}"`);
      }
    } catch (error) {
      errors.push(`Line ${index + 1}: ${error}`);
    }
  });

  return { expenses, errors };
};

const parseExpenseLine = (line: string, nameMap: Map<string, Person>, meId: string): ParsedExpense | null => {
  // Convert to lowercase for parsing
  const lowerLine = line.toLowerCase();
  
  // Patterns to match:
  // "i owe [name] [amount]"
  // "[name] owes me [amount]"
  // "i paid [amount] for [description]"
  // "[name] paid [amount] for [description]"
  
  // Pattern 1: "i owe [name] [amount]"
  let match = lowerLine.match(/^i\s+owe\s+([a-zA-Z\s]+?)\s+(\d+(?:\.\d+)?)\s*(?:rs|rupees|dollars?|\$)?$/);
  if (match) {
    const name = match[1].trim();
    const amount = parseFloat(match[2]);
    const person = nameMap.get(name);
    
    if (!person) {
      throw new Error(`Person "${name}" not found in participants`);
    }
    
    return {
      title: `Owed to ${person.name}`,
      amount,
      paidBy: person.id,
      splitBetween: [meId],
      description: `Amount owed to ${person.name}`,
    };
  }

  // Pattern 2: "[name] owes me [amount]"
  match = lowerLine.match(/^([a-zA-Z\s]+?)\s+owes?\s+me\s+(\d+(?:\.\d+)?)\s*(?:rs|rupees|dollars?|\$)?$/);
  if (match) {
    const name = match[1].trim();
    const amount = parseFloat(match[2]);
    const person = nameMap.get(name);
    
    if (!person) {
      throw new Error(`Person "${name}" not found in participants`);
    }
    
    return {
      title: `Owed by ${person.name}`,
      amount,
      paidBy: meId,
      splitBetween: [person.id],
      description: `Amount owed by ${person.name}`,
    };
  }

  // Pattern 3: "i paid [amount] for [description]"
  match = lowerLine.match(/^i\s+paid\s+(\d+(?:\.\d+)?)\s*(?:rs|rupees|dollars?|\$)?\s+for\s+(.+)$/);
  if (match) {
    const amount = parseFloat(match[1]);
    const description = match[2].trim();
    
    return {
      title: description,
      amount,
      paidBy: meId,
      splitBetween: Array.from(nameMap.values()).map(p => p.id).concat([meId]),
      description: `Paid for ${description}`,
    };
  }

  // Pattern 4: "[name] paid [amount] for [description]"
  match = lowerLine.match(/^([a-zA-Z\s]+?)\s+paid\s+(\d+(?:\.\d+)?)\s*(?:rs|rupees|dollars?|\$)?\s+for\s+(.+)$/);
  if (match) {
    const name = match[1].trim();
    const amount = parseFloat(match[2]);
    const description = match[3].trim();
    const person = nameMap.get(name);
    
    if (!person) {
      throw new Error(`Person "${name}" not found in participants`);
    }
    
    return {
      title: description,
      amount,
      paidBy: person.id,
      splitBetween: Array.from(nameMap.values()).map(p => p.id).concat([meId]),
      description: `${person.name} paid for ${description}`,
    };
  }

  // Pattern 5: Simple format "[amount] [description]" (assumes current user paid)
  match = lowerLine.match(/^(\d+(?:\.\d+)?)\s*(?:rs|rupees|dollars?|\$)?\s+(.+)$/);
  if (match) {
    const amount = parseFloat(match[1]);
    const description = match[2].trim();
    
    return {
      title: description,
      amount,
      paidBy: meId,
      splitBetween: Array.from(nameMap.values()).map(p => p.id).concat([meId]),
      description,
    };
  }

  return null;
};

// Generate example text for users
export const getExampleText = (participants: Person[]): string => {
  const names = participants.slice(0, 2).map(p => p.name.toLowerCase());
  const name1 = names[0] || 'amit';
  const name2 = names[1] || 'priya';
  
  return `Examples of supported formats:

I owe ${name1} 100 rs
${name2} owes me 50 rs
I paid 200 for dinner
${name1} paid 150 for groceries
300 taxi ride
250 movie tickets

Supported currencies: rs, rupees, dollars, $
You can also omit currency symbols.`;
};