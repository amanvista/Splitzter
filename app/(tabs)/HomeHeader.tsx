import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/colors';

interface HomeHeaderProps {
  onAddJourney: () => void;
  isLoading?: boolean;
}

export function HomeHeader({ onAddJourney, isLoading }: HomeHeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.header}
    >
      <ThemedText style={styles.headerTitle}>Splitzter</ThemedText>
      <ThemedText style={styles.headerSubtitle}>
        {isLoading ? 'Loading your journeys...' : 'Track & Split Expenses'}
      </ThemedText>

      {!isLoading && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddJourney}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.addButtonIcon}>+</ThemedText>
          <ThemedText style={styles.addButtonText}>New Journey</ThemedText>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  addButtonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});
