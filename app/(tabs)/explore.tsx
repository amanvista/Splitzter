import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getJourneyExpenses, getJourneys } from '@/lib/database';
import { Journey } from '@/types';

interface JourneyStats {
  journey: Journey;
  totalExpenses: number;
  expenseCount: number;
  avgExpensePerPerson: number;
}

export default function ExploreScreen() {
  const [journeyStats, setJourneyStats] = useState<JourneyStats[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalJourneys: 0,
    totalExpenses: 0,
    totalAmount: 0,
    avgExpensePerJourney: 0,
  });

  const loadStatistics = async () => {
    try {
      const journeys = await getJourneys();
      const stats: JourneyStats[] = [];
      let totalExpenses = 0;
      let totalAmount = 0;

      for (const journey of journeys) {
        const expenses = await getJourneyExpenses(journey.id);
        const journeyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const avgPerPerson = journey.participants.length > 0 ? journeyTotal / journey.participants.length : 0;

        stats.push({
          journey,
          totalExpenses: journeyTotal,
          expenseCount: expenses.length,
          avgExpensePerPerson: avgPerPerson,
        });

        totalExpenses += expenses.length;
        totalAmount += journeyTotal;
      }

      setJourneyStats(stats.sort((a, b) => b.totalExpenses - a.totalExpenses));
      setOverallStats({
        totalJourneys: journeys.length,
        totalExpenses,
        totalAmount,
        avgExpensePerJourney: journeys.length > 0 ? totalAmount / journeys.length : 0,
      });
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [])
  );

  const renderJourneyStat = ({ item }: { item: JourneyStats }) => (
    <ThemedView style={styles.statCard}>
      <ThemedText style={styles.journeyName}>{item.journey.name}</ThemedText>
      <ThemedView style={styles.statRow}>
        <ThemedText style={styles.statLabel}>Total Expenses:</ThemedText>
        <ThemedText style={styles.statValue}>${item.totalExpenses.toFixed(2)}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.statRow}>
        <ThemedText style={styles.statLabel}>Number of Expenses:</ThemedText>
        <ThemedText style={styles.statValue}>{item.expenseCount}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.statRow}>
        <ThemedText style={styles.statLabel}>Avg per Person:</ThemedText>
        <ThemedText style={styles.statValue}>${item.avgExpensePerPerson.toFixed(2)}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.statRow}>
        <ThemedText style={styles.statLabel}>Participants:</ThemedText>
        <ThemedText style={styles.statValue}>{item.journey.participants.length}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Statistics</ThemedText>

      <ThemedView style={styles.overallSection}>
        <ThemedText style={styles.sectionTitle}>Overall Summary</ThemedText>
        <ThemedView style={styles.overallCard}>
          <ThemedView style={styles.overallRow}>
            <ThemedView style={styles.overallStat}>
              <ThemedText style={styles.overallNumber}>{overallStats.totalJourneys}</ThemedText>
              <ThemedText style={styles.overallLabel}>Journeys</ThemedText>
            </ThemedView>
            <ThemedView style={styles.overallStat}>
              <ThemedText style={styles.overallNumber}>{overallStats.totalExpenses}</ThemedText>
              <ThemedText style={styles.overallLabel}>Expenses</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.overallRow}>
            <ThemedView style={styles.overallStat}>
              <ThemedText style={styles.overallNumber}>${overallStats.totalAmount.toFixed(0)}</ThemedText>
              <ThemedText style={styles.overallLabel}>Total Amount</ThemedText>
            </ThemedView>
            <ThemedView style={styles.overallStat}>
              <ThemedText style={styles.overallNumber}>${overallStats.avgExpensePerJourney.toFixed(0)}</ThemedText>
              <ThemedText style={styles.overallLabel}>Avg per Journey</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.journeySection}>
        <ThemedText style={styles.sectionTitle}>Journey Breakdown</ThemedText>
        {journeyStats.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No journey data yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Create journeys and add expenses to see statistics
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={journeyStats}
            renderItem={renderJourneyStat}
            keyExtractor={(item) => item.journey.id}
            scrollEnabled={false}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  overallSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  overallCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  overallStat: {
    alignItems: 'center',
  },
  overallNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  overallLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  journeySection: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  journeyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});