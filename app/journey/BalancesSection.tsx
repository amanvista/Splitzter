import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Person } from '@/types';

import { THEME } from './theme';

interface BalancesSectionProps {
  participants: Person[];
  balances: { [personId: string]: number };
}

export function BalancesSection({ participants, balances }: BalancesSectionProps) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionHeader}>Group Balances</ThemedText>
      <View style={styles.card}>
        {participants.map((p: Person) => {
          const bal = balances[p.id] || 0;
          return (
            <View key={p.id} style={styles.pRow}>
              <View style={styles.pAvatar}>
                <ThemedText style={styles.pAvatarText}>{p.name[0]}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.pName}>{p.name}</ThemedText>
                <ThemedText 
                  style={[
                    styles.pStatus, 
                    bal < 0 ? { color: THEME.success } : 
                    bal > 0 ? { color: THEME.error } : {}
                  ]}
                >
                  {bal < 0 ? 'is owed' : bal > 0 ? 'owes' : 'settled up'}
                </ThemedText>
              </View>
              <ThemedText 
                style={[
                  styles.pAmount, 
                  bal < 0 ? { color: THEME.success } : 
                  bal > 0 ? { color: THEME.error } : {}
                ]}
              >
                {bal === 0 ? '—' : `₹${Math.abs(bal).toLocaleString()}`}
              </ThemedText>
            </View>
          );
        })}
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
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: THEME.border 
  },
  pRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  pAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 15, 
    backgroundColor: '#F1F5F9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15 
  },
  pAvatarText: { fontSize: 16, fontWeight: '700', color: THEME.textMuted },
  pName: { fontSize: 16, fontWeight: '600', color: THEME.text },
  pStatus: { fontSize: 12, color: THEME.textMuted, marginTop: 2 },
  pAmount: { fontSize: 16, fontWeight: '700' },
});