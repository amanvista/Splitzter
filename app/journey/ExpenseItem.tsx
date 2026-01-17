import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatExpenseActivity } from '@/lib/expense-formatter';
import { Expense, Person } from '@/types';

import { THEME } from './theme';

interface ExpenseItemProps {
  expense: Expense;
  participants: Person[];
  getPersonName: (personId: string) => string;
  onPress: () => void;
  onDelete: () => void;
}

export function ExpenseItem({ expense, participants, getPersonName, onPress, onDelete }: ExpenseItemProps) {
  const activityText = formatExpenseActivity(expense, participants, getPersonName);
  
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
          <ThemedText style={styles.expenseTitle} numberOfLines={2}>
            {activityText}
          </ThemedText>
          <ThemedText style={styles.expenseDate}>
            {new Date(expense.date).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
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
  expenseTitle: { fontSize: 14, fontWeight: '600', color: THEME.text, lineHeight: 20 },
  expenseDate: { fontSize: 11, color: THEME.textMuted, marginTop: 6 },
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