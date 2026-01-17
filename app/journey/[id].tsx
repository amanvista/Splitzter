import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { EditJourneyModal } from '@/components/edit-journey-modal';
import { ReminderModal } from '@/components/reminder-modal';
import { ShareModal } from '@/components/share-modal';
import { calculateJourneyBalance } from '@/lib/calculations';
import { getJourneyImageUrl } from '@/lib/journey-images';
import { sendPaymentReminder, sendSettlementConfirmation } from '@/lib/whatsapp-reminders';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteExpenseThunk, loadExpensesForJourney, updateJourneyThunk } from '@/store/thunks';
import { Expense, Settlement } from '@/types';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
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
    router.push(`/add-expense?journeyId=${id}&expenseId=${expenseId}`);
  };

  const handleEditJourney = async (name: string, description: string) => {
    if (!journey) return;
    
    try {
      const updatedJourney = {
        ...journey,
        name,
        description,
      };
      await dispatch(updateJourneyThunk(updatedJourney)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to update journey');
    }
  };

  const handleSendReminder = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setShowReminderModal(true);
  };

  const handleSendPaymentReminder = async () => {
    if (!selectedSettlement || !journey) return;
    
    const fromPerson = journey.participants.find(p => p.id === selectedSettlement.from);
    const toPerson = journey.participants.find(p => p.id === selectedSettlement.to);
    
    if (!fromPerson || !toPerson) {
      throw new Error('Could not find participant information');
    }
    
    await sendPaymentReminder(selectedSettlement, fromPerson, toPerson, journey.name);
  };

  const handleSendSettlementConfirmation = async () => {
    if (!selectedSettlement || !journey) return;
    
    const fromPerson = journey.participants.find(p => p.id === selectedSettlement.from);
    const toPerson = journey.participants.find(p => p.id === selectedSettlement.to);
    
    if (!fromPerson || !toPerson) {
      throw new Error('Could not find participant information');
    }
    
    await sendSettlementConfirmation(selectedSettlement, fromPerson, toPerson, journey.name);
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
          onEdit={() => setShowEditModal(true)}
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
              onSendReminder={handleSendReminder}
            />
          )}

          <BalancesSection
            participants={journey.participants}
            balances={balance?.balances || {}}
          />

          <ExpensesSection
            expenses={expenses}
            participants={journey.participants}
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

      <EditJourneyModal
        visible={showEditModal}
        journeyName={journey.name}
        journeyDescription={journey.description}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditJourney}
      />

      <ReminderModal
        visible={showReminderModal}
        settlement={selectedSettlement}
        fromPerson={selectedSettlement ? journey.participants.find(p => p.id === selectedSettlement.from) || null : null}
        toPerson={selectedSettlement ? journey.participants.find(p => p.id === selectedSettlement.to) || null : null}
        journeyName={journey.name}
        onClose={() => {
          setShowReminderModal(false);
          setSelectedSettlement(null);
        }}
        onSendReminder={handleSendPaymentReminder}
        onSendConfirmation={handleSendSettlementConfirmation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
});