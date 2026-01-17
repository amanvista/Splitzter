import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Settlement } from '@/types';

import { THEME } from './theme';

interface SettlementsSectionProps {
  settlements: Settlement[];
  getPersonName: (personId: string) => string;
}

export function SettlementsSection({ settlements, getPersonName }: SettlementsSectionProps) {
  if (settlements.length === 0) return null;

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionHeader}>Suggested Payments</ThemedText>
      <View style={styles.settleBox}>
        {settlements.map((s: Settlement, i: number) => (
          <View key={i} style={styles.settleRow}>
            <View style={styles.settleIcon}>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </View>
            <ThemedText style={styles.settleText}>
              <ThemedText style={styles.bold}>{getPersonName(s.from)}</ThemedText> owes{' '}
              <ThemedText style={styles.bold}>{getPersonName(s.to)}</ThemedText>
            </ThemedText>
            <ThemedText style={styles.settleAmount}>₹{s.amount.toLocaleString()}</ThemedText>
          </View>
        ))}
      </View>
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
  settleText: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 14, 
    color: '#4338CA' 
  },
  settleAmount: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: THEME.primary 
  },
  bold: { fontWeight: '700' },
});