import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, View } from 'react-native';

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
      let totalAmount = 0;
      let totalExpCount = 0;

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

        totalExpCount += expenses.length;
        totalAmount += journeyTotal;
      }

      setJourneyStats(stats.sort((a, b) => b.totalExpenses - a.totalExpenses));
      setOverallStats({
        totalJourneys: journeys.length,
        totalExpenses: totalExpCount,
        totalAmount,
        avgExpensePerJourney: journeys.length > 0 ? totalAmount / journeys.length : 0,
      });
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  useFocusEffect(useCallback(() => { loadStatistics(); }, []));

  const renderJourneyStat = ({ item }: { item: JourneyStats }) => {
    // Calculate percentage relative to total spent (for a small visual bar)
    const intensity = Math.min((item.totalExpenses / overallStats.totalAmount) * 100, 100);

    return (
      <ThemedView style={styles.statCard}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.journeyName}>{item.journey.name}</ThemedText>
          <ThemedText style={styles.journeyPrice}>₹{item.totalExpenses.toLocaleString()}</ThemedText>
        </View>
        
        {/* Visual Progress Bar */}
        <View style={styles.progressBarBg}>
          <LinearGradient 
            colors={['#6366f1', '#a855f7']} 
            start={{x:0, y:0}} end={{x:1, y:0}} 
            style={[styles.progressBarFill, { width: `${intensity || 0}%` }]} 
          />
        </View>

        <View style={styles.cardGrid}>
          <View style={styles.gridItem}>
            <Ionicons name="receipt-outline" size={14} color="#94A3B8" />
            <ThemedText style={styles.gridValue}>{item.expenseCount} Items</ThemedText>
          </View>
          <View style={styles.gridItem}>
            <Ionicons name="people-outline" size={14} color="#94A3B8" />
            <ThemedText style={styles.gridValue}>{item.journey.participants.length} Split</ThemedText>
          </View>
          <View style={[styles.gridItem, { flex: 1.5 }]}>
            <Ionicons name="wallet-outline" size={14} color="#94A3B8" />
            <ThemedText style={styles.gridValue}>Avg: ₹{item.avgExpensePerPerson.toFixed(0)}</ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.title}>Analytics</ThemedText>

      {/* Hero Overall Stats Card */}
      <LinearGradient colors={['#6366f1', '#8b5cf6', '#a855f7']} style={styles.heroCard}>
        <ThemedText style={styles.heroLabel}>Lifetime Spends</ThemedText>
        <ThemedText style={styles.heroMainAmount}>₹{overallStats.totalAmount.toLocaleString()}</ThemedText>
        
        <View style={styles.heroGrid}>
          <View style={styles.heroStatItem}>
            <ThemedText style={styles.heroStatNum}>{overallStats.totalJourneys}</ThemedText>
            <ThemedText style={styles.heroStatLabel}>Journeys</ThemedText>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStatItem}>
            <ThemedText style={styles.heroStatNum}>{overallStats.totalExpenses}</ThemedText>
            <ThemedText style={styles.heroStatLabel}>Expenses</ThemedText>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStatItem}>
            <ThemedText style={styles.heroStatNum}>₹{overallStats.avgExpensePerJourney.toFixed(0)}</ThemedText>
            <ThemedText style={styles.heroStatLabel}>Avg/Trip</ThemedText>
          </View>
        </View>
      </LinearGradient>

      <ThemedView style={styles.journeySection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Journey Breakdown</ThemedText>
          <Ionicons name="bar-chart-outline" size={20} color="#64748B" />
        </View>

        {journeyStats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="pie-chart-outline" size={48} color="#CBD5E1" />
            <ThemedText style={styles.emptyText}>No Analytics Yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>Your trip spending patterns will appear here.</ThemedText>
          </View>
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
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 24, paddingTop: Platform.OS === 'ios' ? 40 : 20 },
  
  heroCard: {
    padding: 24,
    borderRadius: 32,
    marginBottom: 32,
    ...Platform.select({
      ios: { shadowColor: '#6366f1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  heroLabel: { color: '#fff', fontSize: 13, fontWeight: '600', opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 },
  heroMainAmount: { color: '#fff', fontSize: 40, fontWeight: '900', marginVertical: 12 },
  heroGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 15 },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatNum: { color: '#fff', fontSize: 16, fontWeight: '800' },
  heroStatLabel: { color: '#fff', fontSize: 10, opacity: 0.7, marginTop: 2, fontWeight: '600' },
  heroDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.2)' },

  journeySection: { marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  journeyName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  journeyPrice: { fontSize: 16, fontWeight: '800', color: '#6366f1' },
  
  progressBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  
  cardGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  gridItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  gridValue: { fontSize: 12, fontWeight: '600', color: '#64748B' },

  emptyState: { alignItems: 'center', padding: 40, marginTop: 20 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#94A3B8', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#CBD5E1', textAlign: 'center', marginTop: 8 },
});