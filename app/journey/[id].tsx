import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { ShareModal } from '@/components/share-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';
import { calculateJourneyBalance, getPersonExpensesSummary } from '@/lib/calculations';
import { getJourneyById, getJourneyExpenses } from '@/lib/database';
import { Expense, Journey, JourneyBalance, Person } from '@/types';

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState<JourneyBalance | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();

  const loadJourneyData = async () => {
    if (!id) return;

    try {
      const journeyData = await getJourneyById(id);
      if (!journeyData) {
        Alert.alert('Error', 'Journey not found');
        router.back();
        return;
      }

      const expenseData = await getJourneyExpenses(id);
      const balanceData = calculateJourneyBalance(expenseData, journeyData.participants);

      setJourney(journeyData);
      setExpenses(expenseData);
      setBalance(balanceData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load journey data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadJourneyData();
    }, [id])
  );

  const getPersonName = (personId: string): string => {
    return journey?.participants.find(p => p.id === personId)?.name || 'Unknown';
  };

  const handleShare = async () => {
    if (!journey) return;
    setShowShareModal(true);
  };

  const renderExpense = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => router.push(`/edit-expense/${item.id}`)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.expenseHeader}>
        <ThemedView style={styles.expenseIcon}>
          <ThemedText style={styles.expenseIconText}>💰</ThemedText>
        </ThemedView>
        <ThemedView style={styles.expenseInfo}>
          <ThemedText style={styles.expenseTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.expenseDetails}>
            Paid by {getPersonName(item.paidBy)}
          </ThemedText>
          <ThemedText style={styles.expenseDate}>
            {new Date(item.date).toLocaleDateString()}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.expenseAmountContainer}>
          <ThemedText style={styles.expenseAmount}>${item.amount.toFixed(2)}</ThemedText>
          <ThemedText style={styles.editHint}>Tap to edit</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.expenseSplit}>
        <ThemedText style={styles.splitLabel}>Split between:</ThemedText>
        <ThemedText style={styles.splitNames}>
          {item.splitBetween.map(id => getPersonName(id)).join(', ')}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  const renderParticipantSummary = ({ item }: { item: Person }) => {
    const summary = getPersonExpensesSummary(expenses, item.id);
    const balanceAmount = balance?.balances[item.id] || 0;
    
    return (
      <ThemedView style={styles.participantCard}>
        <ThemedView style={styles.participantHeader}>
          <ThemedView style={[
            styles.participantAvatar,
            { backgroundColor: balanceAmount > 0 ? Colors.warningLight : balanceAmount < 0 ? Colors.successLight : Colors.textLight }
          ]}>
            <ThemedText style={styles.participantInitial}>
              {item.name.charAt(0).toUpperCase()}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.participantInfo}>
            <ThemedText style={styles.participantName}>{item.name}</ThemedText>
            <ThemedText style={[
              styles.participantBalance,
              balanceAmount > 0 ? styles.owesText : balanceAmount < 0 ? styles.owedText : styles.settledText
            ]}>
              {balanceAmount > 0 
                ? `Owes $${balanceAmount.toFixed(2)}`
                : balanceAmount < 0
                ? `Owed $${Math.abs(balanceAmount).toFixed(2)}`
                : 'All settled'
              }
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.participantStats}>
          <ThemedView style={styles.statColumn}>
            <ThemedText style={styles.statAmount}>${summary.totalPaid.toFixed(2)}</ThemedText>
            <ThemedText style={styles.statLabel}>Paid</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statColumn}>
            <ThemedText style={styles.statAmount}>${summary.totalShare.toFixed(2)}</ThemedText>
            <ThemedText style={styles.statLabel}>Share</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderSettlement = ({ item }: { item: any }) => (
    <ThemedView style={styles.settlementCard}>
      <ThemedView style={styles.settlementIcon}>
        <ThemedText style={styles.settlementIconText}>💸</ThemedText>
      </ThemedView>
      <ThemedText style={styles.settlementText}>
        {getPersonName(item.from)} pays {getPersonName(item.to)} ${item.amount.toFixed(2)}
      </ThemedText>
    </ThemedView>
  );

  if (!journey) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.loadingHeader}
        >
          <ThemedText style={styles.loadingText}>Loading journey...</ThemedText>
        </LinearGradient>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <ThemedView style={styles.headerTop}>
          <ThemedText style={styles.journeyTitle}>{journey.name}</ThemedText>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.shareIcon}>📤</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        {journey.description && (
          <ThemedText style={styles.journeyDescription}>{journey.description}</ThemedText>
        )}
        
        <ThemedView style={styles.summaryCards}>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryAmount}>
              ${balance?.totalExpenses.toFixed(2) || '0.00'}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Spent</ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryAmount}>{expenses.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Expenses</ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryAmount}>{journey.participants.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Members</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.addExpenseButton}
            onPress={() => router.push(`/add-expense?journeyId=${id}`)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.addExpenseIcon}>+</ThemedText>
            <ThemedText style={styles.addExpenseText}>Add Expense</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.importButton}
            onPress={() => router.push(`/import-expenses?journeyId=${id}`)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.importIcon}>📝</ThemedText>
            <ThemedText style={styles.importText}>Import Text</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity
          style={styles.shareButtonBottom}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.shareButtonIcon}>📤</ThemedText>
          <ThemedText style={styles.shareButtonText}>Share Journey Summary</ThemedText>
        </TouchableOpacity>
      </LinearGradient>

      <ThemedView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Balances</ThemedText>
          <FlatList
            data={journey.participants}
            renderItem={renderParticipantSummary}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ThemedView>

        {balance?.settlements && balance.settlements.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Suggested Payments</ThemedText>
            <FlatList
              data={balance.settlements}
              renderItem={renderSettlement}
              keyExtractor={(item, index) => `${item.from}-${item.to}-${index}`}
              scrollEnabled={false}
            />
          </ThemedView>
        )}

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recent Expenses</ThemedText>
          {expenses.length === 0 ? (
            <ThemedView style={styles.emptyExpenses}>
              <ThemedText style={styles.emptyExpensesText}>No expenses yet</ThemedText>
              <ThemedText style={styles.emptyExpensesSubtext}>
                Add your first expense to start tracking
              </ThemedText>
            </ThemedView>
          ) : (
            <FlatList
              data={expenses}
              renderItem={renderExpense}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </ThemedView>
      </ThemedView>

      {journey && (
        <ShareModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          journey={journey}
          expenses={expenses}
        />
      )}
    </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 18,
  },
  loadingHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textInverse,
  },
  journeyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    flex: 1,
    marginRight: 12,
  },
  journeyDescription: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
    marginBottom: 24,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textInverse,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  addExpenseIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginRight: 6,
  },
  addExpenseText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  importIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  importText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  shareButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 12,
  },
  shareButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  content: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  participantCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  participantBalance: {
    fontSize: 14,
    fontWeight: '500',
  },
  owesText: {
    color: Colors.warning,
  },
  owedText: {
    color: Colors.success,
  },
  settledText: {
    color: Colors.textSecondary,
  },
  participantStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statColumn: {
    alignItems: 'center',
  },
  statAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  settlementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  settlementIcon: {
    marginRight: 12,
  },
  settlementIconText: {
    fontSize: 20,
  },
  settlementText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  expenseCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseIcon: {
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 20,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  expenseDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  editHint: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 2,
  },
  expenseSplit: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  splitLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  splitNames: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyExpenses: {
    alignItems: 'center',
    padding: 32,
  },
  emptyExpensesText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyExpensesSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});