import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';
import { deleteExpense, updateExpense } from '@/lib/database';
import { Expense, Journey, Person } from '@/types';

const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', emoji: '🍽️' },
  { name: 'Transportation', emoji: '🚗' },
  { name: 'Accommodation', emoji: '🏨' },
  { name: 'Entertainment', emoji: '🎬' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Other', emoji: '📝' },
];

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [paidBy, setPaidBy] = useState<string>('');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadExpenseData();
  }, [id]);

  const loadExpenseData = async () => {
    if (!id) return;

    try {
      // Find the expense by ID across all journeys
      // This is a simplified approach - in a real app you might want to pass journeyId as well
      const journeys = await import('@/lib/database').then(db => db.getJourneys());
      let foundExpense: Expense | null = null;
      let foundJourney: Journey | null = null;

      for (const j of journeys) {
        const expenses = await import('@/lib/database').then(db => db.getJourneyExpenses(j.id));
        const exp = expenses.find(e => e.id === id);
        if (exp) {
          foundExpense = exp;
          foundJourney = j;
          break;
        }
      }

      if (!foundExpense || !foundJourney) {
        Alert.alert('Error', 'Expense not found');
        router.back();
        return;
      }

      setExpense(foundExpense);
      setJourney(foundJourney);
      setTitle(foundExpense.title);
      setAmount(foundExpense.amount.toString());
      setDescription(foundExpense.description || '');
      setCategory(foundExpense.category || 'Other');
      setPaidBy(foundExpense.paidBy);
      setSplitBetween(foundExpense.splitBetween);
    } catch (error) {
      Alert.alert('Error', 'Failed to load expense data');
      router.back();
    }
  };

  const toggleSplitParticipant = (personId: string) => {
    if (splitBetween.includes(personId)) {
      setSplitBetween(splitBetween.filter(id => id !== personId));
    } else {
      setSplitBetween([...splitBetween, personId]);
    }
  };

  const selectAllParticipants = () => {
    if (journey) {
      setSplitBetween(journey.participants.map(p => p.id));
    }
  };

  const clearAllParticipants = () => {
    setSplitBetween([]);
  };

  const updateExpenseData = () => {
    if (!expense || !journey) return;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an expense title');
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      Alert.alert('Error', 'Please select who paid for this expense');
      return;
    }

    if (splitBetween.length === 0) {
      Alert.alert('Error', 'Please select at least one person to split the expense');
      return;
    }

    setLoading(true);

    try {
      const updatedExpense: Expense = {
        ...expense,
        title: title.trim(),
        amount: expenseAmount,
        paidBy,
        splitBetween,
        category,
        description: description.trim(),
      };

      updateExpense(updatedExpense);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpenseData = () => {
    if (!expense) return;

    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteExpense(expense.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const renderParticipant = ({ item }: { item: Person }) => {
    const isPaidBy = paidBy === item.id;
    const isInSplit = splitBetween.includes(item.id);
    
    return (
      <ThemedView style={styles.participantCard}>
        <ThemedView style={styles.participantHeader}>
          <ThemedView style={[
            styles.participantAvatar,
            isPaidBy && styles.paidByAvatar
          ]}>
            <ThemedText style={styles.participantInitial}>
              {item.name.charAt(0).toUpperCase()}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.participantInfo}>
            <ThemedText style={styles.participantName}>{item.name}</ThemedText>
            {isPaidBy && (
              <ThemedText style={styles.paidByLabel}>Paid for this</ThemedText>
            )}
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.participantActions}>
          <TouchableOpacity
            style={[styles.actionButton, isPaidBy && styles.selectedActionButton]}
            onPress={() => setPaidBy(item.id)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.actionText, isPaidBy && styles.selectedActionText]}>
              Paid
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, isInSplit && styles.selectedActionButton]}
            onPress={() => toggleSplitParticipant(item.id)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.actionText, isInSplit && styles.selectedActionText]}>
              Split
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderCategory = ({ item }: { item: typeof EXPENSE_CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[styles.categoryButton, category === item.name && styles.selectedCategory]}
      onPress={() => setCategory(item.name)}
      activeOpacity={0.7}
    >
      <ThemedText style={styles.categoryEmoji}>{item.emoji}</ThemedText>
      <ThemedText style={[styles.categoryText, category === item.name && styles.selectedCategoryText]}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  if (!journey || !expense) {
    return (
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.loadingHeader}
        >
          <ThemedText style={styles.loadingText}>Loading expense...</ThemedText>
        </LinearGradient>
      </ThemedView>
    );
  }

  const splitAmount = parseFloat(amount) / splitBetween.length || 0;

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Edit Expense</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Update expense details</ThemedText>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Expense Title *</ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What did you spend on?"
            placeholderTextColor={Colors.textLight}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Amount *</ThemedText>
          <ThemedView style={styles.amountContainer}>
            <ThemedText style={styles.currencySymbol}>$</ThemedText>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.textLight}
              keyboardType="decimal-pad"
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <FlatList
            data={EXPENSE_CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional notes about this expense"
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={3}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.participantHeader}>
            <ThemedText style={styles.label}>Who's Involved?</ThemedText>
            <ThemedView style={styles.participantControls}>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={selectAllParticipants}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.controlText}>All</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={clearAllParticipants}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.controlText}>None</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          <FlatList
            data={journey.participants}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ThemedView>

        {splitBetween.length > 0 && (
          <ThemedView style={styles.splitSummaryCard}>
            <ThemedView style={styles.splitSummaryHeader}>
              <ThemedText style={styles.splitSummaryTitle}>Split Summary</ThemedText>
              <ThemedText style={styles.splitSummaryAmount}>
                ${splitAmount.toFixed(2)} each
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.splitSummaryText}>
              Split between {splitBetween.length} people
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.updateButton, loading && styles.disabledButton]}
            onPress={updateExpenseData}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading ? [Colors.textLight, Colors.textLight] : [Colors.primary, Colors.primaryLight]}
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Updating...' : 'Update Expense'}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteExpenseData}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.warning, Colors.warningDark]}
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.buttonText}>Delete Expense</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    paddingVertical: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryList: {
    maxHeight: 80,
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: Colors.textInverse,
  },
  participantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantControls: {
    flexDirection: 'row',
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
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
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paidByAvatar: {
    backgroundColor: Colors.secondary,
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
  paidByLabel: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '500',
  },
  participantActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginLeft: 8,
  },
  selectedActionButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedActionText: {
    color: Colors.textInverse,
  },
  splitSummaryCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  splitSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  splitSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  splitSummaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  splitSummaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  updateButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});