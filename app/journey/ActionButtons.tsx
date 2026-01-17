import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { THEME } from './theme';

interface ActionButtonsProps {
  onAddExpense: () => void;
  onImportExpenses: () => void;
}

export function ActionButtons({ onAddExpense, onImportExpenses }: ActionButtonsProps) {
  return (
    <View style={styles.actionRow}>
      <TouchableOpacity 
        style={styles.btnPrimary} 
        onPress={onAddExpense}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <ThemedText style={styles.btnTextPrimary}>Add Expense</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.btnSecondary}
        onPress={onImportExpenses}
      >
        <Ionicons name="scan-outline" size={20} color={THEME.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: { 
    flexDirection: 'row', 
    marginTop: -25, 
    gap: 12, 
    marginBottom: 30 
  },
  btnPrimary: { 
    flex: 1, 
    backgroundColor: THEME.primary, 
    height: 56, 
    borderRadius: 18, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    shadowColor: THEME.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5 
  },
  btnTextPrimary: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnSecondary: { 
    width: 56, 
    height: 56, 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: THEME.border 
  },
});
