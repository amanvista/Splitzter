import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';

export function EmptyJourneysState() {
  return (
    <ThemedView style={styles.emptyState}>
      <ThemedView style={styles.emptyIcon}>
        <ThemedText style={styles.emptyIconText}>🎒</ThemedText>
      </ThemedView>
      <ThemedText style={styles.emptyTitle}>No journeys yet</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Start your first journey to track and split expenses with friends
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
