import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Expense } from '@/types';

import { THEME } from './theme';

interface ExpenseItemProps {
  expense: Expense;
  getPersonName: (personId: string) => string;
  onPress: () => void;
  onDelete: () => void;
}

export function ExpenseItem({ expense, getPersonName, onPress, onDelete }: ExpenseItemProps) {
  return (
    <View style={styles.expenseWrapper}>
      <TouchableOpacity
        style={styles.expenseCard}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <View style={styles.expenseIconWrapper}>
          <Ionicons name="card-outline" size={20} color={THEME.primary} />
        </View>
        <View style={styles.expenseMain}>
          <ThemedText style={styles.expenseTitle} numberOfLines={1}>
            {expense.title}
          </ThemedText>
          <ThemedText style={styles.expenseSub}>
            Paid by {getPersonName(expense.paidBy)}
          </ThemedText>
        </View>
        <View style={styles.expenseRight}>
          <ThemedText style={styles.expenseAmount}>
            ₹{expense.amount.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.expenseDate}>
            {new Date(expense.date).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric' 
            })}
          </ThemedText>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={onDelete}
        activeOpacity={0.5}
      >
        <Ionicons name="trash-outline" size={20} color={THEME.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    gap: 10 
  },
  expenseCard: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: THEME.border 
  },
  expenseIconWrapper: { 
    width: 44, 
    height: 44, 
    borderRadius: 15, 
    backgroundColor: '#EEF2FF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  expenseMain: { flex: 1 },
  expenseTitle: { fontSize: 15, fontWeight: '700', color: THEME.text },
  expenseSub: { fontSize: 12, color: THEME.textMuted, marginTop: 3 },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { fontSize: 16, fontWeight: '700', color: THEME.text },
  expenseDate: { fontSize: 10, color: THEME.textMuted, marginTop: 4 },
  deleteBtn: { 
    width: 48, 
    height: 56, 
    backgroundColor: '#FFF5F5', 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#FEE2E2' 
  },
});