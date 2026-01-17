import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { ShareModal } from '@/components/share-modal';
import { calculateJourneyBalance } from '@/lib/calculations';
import { getJourneyImageUrl } from '@/lib/journey-images';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteExpenseThunk, loadExpensesForJourney } from '@/store/thunks';
import { Expense } from '@/types';

import { ActionButtons } from './ActionButtons';
import { BalancesSection } from './BalancesSection';
import { ExpensesSection } from './ExpensesSection';
import { JourneyHeader } from './JourneyHeader';
import { SettlementsSection } from './SettlementsSection';
import { THEME } from './theme';

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const journey = useAppSelector((state) => state.journey.currentJourney);
  const expenses = useAppSelector((state) => 
    id ? state.expense.expenses[id] || [] : []
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();

  // Calculate balance whenever expenses or journey changes
  const balance = useMemo(() => {
    if (!journey || !expenses) return null;
    return calculateJourneyBalance(expenses, journey.participants);
  }, [expenses, journey]);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      
      // Load journey and expenses
      dispatch(loadExpensesForJourney(id)).catch(() => {
        Alert.alert('Error', 'Failed to load journey data');
      });
    }, [id, dispatch])
  );

  const getPersonName = (personId: string) => 
    journey?.participants.find(p => p.id === personId)?.name || 'Unknown';

  const handleDeleteExpense = async (expense: Expense) => {
    if (!id) return;
    try {
      await dispatch(deleteExpenseThunk({ journeyId: id, expenseId: expense.id })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Could not delete expense');
    }
  };

  const handleAddExpense = () => {
    router.push(`/add-expense?journeyId=${id}`);
  };

  const handleImportExpenses = () => {
    router.push(`/import-expenses?journeyId=${id}`);
  };

  const handleAddMember = () => {
    router.push(`/add-member?journeyId=${id}`);
  };

  const handleEditExpense = (expenseId: string) => {
    router.push(`/edit-expense/${expenseId}`);
  };

  if (!journey) return null;

  const journeyImageUrl = getJourneyImageUrl(journey.id, journey.imageUrl);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <JourneyHeader
          journey={journey}
          imageUrl={journeyImageUrl}
          totalExpenses={balance?.totalExpenses || 0}
          expenseCount={expenses.length}
          onBack={() => router.back()}
          onShare={() => setShowShareModal(true)}
        />

        <View style={styles.body}>
          <ActionButtons
            onAddExpense={handleAddExpense}
            onImportExpenses={handleImportExpenses}
            onAddMember={handleAddMember}
          />

          {balance?.settlements && (
            <SettlementsSection
              settlements={balance.settlements}
              getPersonName={getPersonName}
            />
          )}

          <BalancesSection
            participants={journey.participants}
            balances={balance?.balances || {}}
          />

          <ExpensesSection
            expenses={expenses}
            getPersonName={getPersonName}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </View>
      </ScrollView>

      <ShareModal 
        visible={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        journey={journey} 
        expenses={expenses} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
});