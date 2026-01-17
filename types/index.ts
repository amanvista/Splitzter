export interface Person {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isFromContacts: boolean;
}

export interface Journey {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  participants: Person[];
}

export interface Expense {
  id: string;
  journeyId: string;
  title: string;
  amount: number;
  paidBy: string; // Person ID
  splitBetween: string[]; // Array of Person IDs
  category?: string;
  date: string;
  description?: string;
}

export interface Settlement {
  from: string; // Person ID
  to: string; // Person ID
  amount: number;
}

export interface JourneyBalance {
  journeyId: string;
  totalExpenses: number;
  balances: { [personId: string]: number }; // positive = owes money, negative = owed money
  settlements: Settlement[];
}