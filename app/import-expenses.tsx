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
import { getExampleText, ParsedExpense, parseExpenseText } from '@/lib/text-parser';
import { useAppDispatch, useAppSelector } from '@/store';
import { createExpenseThunk } from '@/store/thunks';
import { Expense } from '@/types';

export default function ImportExpensesScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const dispatch = useAppDispatch();
  const journey = useAppSelector((state) => state.journey.currentJourney);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [selectedUser, setSelectedUser] = useState(currentUser); // Local state for "I/me" reference
  const [inputText, setInputText] = useState('');
  const [parsedExpenses, setParsedExpenses] = useState<ParsedExpense[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExample, setShowExample] = useState(true);
  
  const router = useRouter();

  // Update selected user when current user changes
  useEffect(() => {
    if (currentUser && !selectedUser) {
      setSelectedUser(currentUser);
    }
  }, [currentUser]);

  const parseText = () => {
    if (!journey || !inputText.trim()) {
      setParsedExpenses([]);
      setErrors([]);
      return;
    }

    const result = parseExpenseText(inputText, journey.participants);
    
    // Replace 'current_user' with actual selected user ID
    const processedExpenses = result.expenses.map(expense => ({
      ...expense,
      paidBy: expense.paidBy === 'current_user' ? (selectedUser?.id || '') : expense.paidBy,
      splitBetween: expense.splitBetween.map(id => 
        id === 'current_user' ? (selectedUser?.id || '') : id
      ).filter(id => id !== ''),
    }));

    setParsedExpenses(processedExpenses);
    setErrors(result.errors);
  };

  useEffect(() => {
    parseText();
  }, [inputText, journey, currentUser]);

  const importExpenses = async () => {
    if (!journey || parsedExpenses.length === 0) {
      Alert.alert('Error', 'No valid expenses to import');
      return;
    }

    if (errors.length > 0) {
      Alert.alert(
        'Parsing Errors',
        `There are ${errors.length} errors in your text. Do you want to import only the valid expenses?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Import Valid', onPress: () => performImport() },
        ]
      );
    } else {
      performImport();
    }
  };

  const performImport = async () => {
    setLoading(true);

    try {
      for (const parsedExpense of parsedExpenses) {
        const expense: Expense = {
          id: `expense_${Date.now()}_${Math.random()}`,
          journeyId: journey!.id,
          title: parsedExpense.title,
          amount: parsedExpense.amount,
          paidBy: parsedExpense.paidBy,
          splitBetween: parsedExpense.splitBetween,
          category: 'Other',
          date: new Date().toISOString(),
          description: parsedExpense.description || '',
        };

        await dispatch(createExpenseThunk(expense)).unwrap();
      }

      Alert.alert(
        'Success',
        `Successfully imported ${parsedExpenses.length} expenses!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to import expenses');
    } finally {
      setLoading(false);
    }
  };

  const getPersonName = (personId: string): string => {
    if (!journey) return 'Unknown';
    return journey.participants.find(p => p.id === personId)?.name || 'Unknown';
  };

  const renderParsedExpense = ({ item, index }: { item: ParsedExpense; index: number }) => (
    <ThemedView style={styles.expenseCard}>
      <ThemedView style={styles.expenseHeader}>
        <ThemedText style={styles.expenseTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.expenseDetails}>
        Paid by: {getPersonName(item.paidBy)}
      </ThemedText>
      <ThemedText style={styles.expenseDetails}>
        Split between: {item.splitBetween.map(id => getPersonName(id)).join(', ')}
      </ThemedText>
      {item.description && (
        <ThemedText style={styles.expenseDescription}>{item.description}</ThemedText>
      )}
    </ThemedView>
  );

  const renderError = ({ item, index }: { item: string; index: number }) => (
    <ThemedView style={styles.errorCard}>
      <ThemedText style={styles.errorText}>{item}</ThemedText>
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
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Import Expenses</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Add multiple expenses from text</ThemedText>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedView style={styles.labelRow}>
            <ThemedText style={styles.label}>Enter Expenses</ThemedText>
            <TouchableOpacity 
              onPress={() => setShowExample(!showExample)}
              style={styles.exampleButton}
            >
              <ThemedText style={styles.exampleButtonText}>
                {showExample ? 'Hide' : 'Show'} Examples
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {showExample && (
            <ThemedView style={styles.exampleCard}>
              <ThemedText style={styles.exampleText}>
                {getExampleText(journey.participants)}
              </ThemedText>
            </ThemedView>
          )}

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter expenses, one per line..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={10}
          />
        </ThemedView>

        {currentUser && (
          <ThemedView style={styles.userSection}>
            <ThemedText style={styles.userLabel}>
              "I" and "me" refer to: {selectedUser?.name || 'Select a user'}
            </ThemedText>
            <FlatList
              data={journey.participants}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.userChip,
                    selectedUser?.id === item.id && styles.selectedUserChip
                  ]}
                  onPress={() => setSelectedUser(item)}
                >
                  <ThemedText style={[
                    styles.userChipText,
                    selectedUser?.id === item.id && styles.selectedUserChipText
                  ]}>
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </ThemedView>
        )}

        {errors.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.errorTitle}>Parsing Errors ({errors.length})</ThemedText>
            <FlatList
              data={errors}
              renderItem={renderError}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </ThemedView>
        )}

        {parsedExpenses.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.previewTitle}>
              Preview ({parsedExpenses.length} expenses)
            </ThemedText>
            <FlatList
              data={parsedExpenses}
              renderItem={renderParsedExpense}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </ThemedView>
        )}

        <TouchableOpacity
          style={[
            styles.importButton,
            (loading || parsedExpenses.length === 0) && styles.disabledButton
          ]}
          onPress={importExpenses}
          disabled={loading || parsedExpenses.length === 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              loading || parsedExpenses.length === 0
                ? [Colors.textLight, Colors.textLight]
                : [Colors.primary, Colors.primaryLight]
            }
            style={styles.importButtonGradient}
          >
            <ThemedText style={styles.importButtonText}>
              {loading
                ? 'Importing...'
                : parsedExpenses.length === 0
                ? 'No Expenses to Import'
                : `Import ${parsedExpenses.length} Expenses`
              }
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  exampleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },
  exampleButtonText: {
    fontSize: 12,
    color: Colors.textInverse,
    fontWeight: '500',
  },
  exampleCard: {
    backgroundColor: Colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  exampleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
    height: 200,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  userSection: {
    marginBottom: 24,
  },
  userLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  userChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedUserChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  userChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedUserChipText: {
    color: Colors.textInverse,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 12,
  },
  errorCard: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  errorText: {
    fontSize: 14,
    color: Colors.warning,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  expenseDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  importButton: {
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  importButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  importButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});