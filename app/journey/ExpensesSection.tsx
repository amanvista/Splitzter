import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Expense, Person } from '@/types';

import { ExpenseItem } from './ExpenseItem';
import { THEME } from './theme';

interface ExpensesSectionProps {
  expenses: Expense[];
  participants: Person[];
  getPersonName: (personId: string) => string;
  onEditExpense: (expenseId: string) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export function ExpensesSection({ 
  expenses, 
  participants,
  getPersonName, 
  onEditExpense, 
  onDeleteExpense 
}: ExpensesSectionProps) {
  const confirmDelete = (expense: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => onDeleteExpense(expense)
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionHeader}>Activity</ThemedText>
      {expenses.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText style={styles.emptyText}>Nothing recorded yet</ThemedText>
        </View>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            participants={participants}
            getPersonName={getPersonName}
            onPress={() => onEditExpense(expense.id)}
            onDelete={() => confirmDelete(expense)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 30 },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: THEME.text, 
    marginBottom: 15 
  },
  empty: { padding: 30, alignItems: 'center' },
  emptyText: { color: THEME.textMuted, fontSize: 14 },
});