import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Settlement } from '@/types';

import { THEME } from './theme';

interface SettlementsSectionProps {
  settlements: Settlement[];
  getPersonName: (personId: string) => string;
  onSendReminder: (settlement: Settlement) => void;
  onSettlePayment: (settlement: Settlement) => void;
  onSettleAll: () => void;
}

export function SettlementsSection({ settlements, getPersonName, onSendReminder, onSettlePayment, onSettleAll }: SettlementsSectionProps) {
  if (settlements.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionHeader}>Suggested Payments</ThemedText>
        <TouchableOpacity
          style={styles.settleAllButton}
          onPress={onSettleAll}
        >
          <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
          <ThemedText style={styles.settleAllText}>Settle All</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.settleBox}>
        {settlements.map((s: Settlement, i: number) => (
          <View key={i} style={styles.settleRow}>
            <View style={styles.settleIcon}>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </View>
            <View style={styles.settleContent}>
              <ThemedText style={styles.settleText}>
                <ThemedText style={styles.bold}>{getPersonName(s.from)}</ThemedText> pays{' '}
                <ThemedText style={styles.bold}>{getPersonName(s.to)}</ThemedText>
              </ThemedText>
              <ThemedText style={styles.settleAmount}>₹{s.amount.toLocaleString()}</ThemedText>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.settleButton}
                onPress={() => onSettlePayment(s)}
              >
                <Ionicons name="checkmark" size={16} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reminderButton}
                onPress={() => onSendReminder(s)}
              >
                <Ionicons name="chatbubble-outline" size={16} color={THEME.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 30 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: THEME.text,
  },
  settleAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 4,
  },
  settleAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  settleBox: { 
    backgroundColor: '#EEF2FF', 
    borderRadius: 24, 
    padding: 20, 
    borderLeftWidth: 5, 
    borderLeftColor: THEME.primary 
  },
  settleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  settleIcon: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: THEME.primary, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  settleContent: {
    flex: 1,
    marginLeft: 12,
  },
  settleText: { 
    fontSize: 14, 
    color: '#4338CA' 
  },
  settleAmount: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: THEME.primary,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: { fontWeight: '700' },
});