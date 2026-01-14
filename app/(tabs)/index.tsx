import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';
import { getJourneys } from '@/lib/database';
import { Journey } from '@/types';

export default function HomeScreen() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadJourneys = async () => {
    try {
      setLoading(true);
      const loadedJourneys = await getJourneys();
      setJourneys(loadedJourneys);
    } catch (error) {
      Alert.alert('Error', 'Failed to load journeys');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadJourneys();
    }, [])
  );

  const renderJourney = ({ item }: { item: Journey }) => (
    <TouchableOpacity
      style={styles.journeyCard}
      onPress={() => router.push(`/journey/${item.id}`)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.journeyContent}>
        <ThemedView style={styles.journeyHeader}>
          <ThemedView style={styles.journeyIcon}>
            <ThemedText style={styles.journeyIconText}>
              {item.name.charAt(0).toUpperCase()}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.journeyInfo}>
            <ThemedText style={styles.journeyTitle}>{item.name}</ThemedText>
            {item.description && (
              <ThemedText style={styles.journeyDescription}>{item.description}</ThemedText>
            )}
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.journeyStats}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>{item.participants.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Members</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statDivider} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statDate}>
              {new Date(item.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Created</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <ThemedText style={styles.headerTitle}>Splitzter</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Loading your journeys...</ThemedText>
        </LinearGradient>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Splitzter</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Track & Split Expenses</ThemedText>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-journey')}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.addButtonIcon}>+</ThemedText>
          <ThemedText style={styles.addButtonText}>New Journey</ThemedText>
        </TouchableOpacity>
      </LinearGradient>

      <ThemedView style={styles.content}>
        {journeys.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedView style={styles.emptyIcon}>
              <ThemedText style={styles.emptyIconText}>🎒</ThemedText>
            </ThemedView>
            <ThemedText style={styles.emptyTitle}>No journeys yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Start your first journey to track and split expenses with friends
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={journeys}
            renderItem={renderJourney}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  content: {
    flex: 1,
    paddingTop: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  journeyCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  journeyContent: {
    padding: 20,
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  journeyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  journeyIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  journeyInfo: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  journeyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  journeyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 2,
  },
  statDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },
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