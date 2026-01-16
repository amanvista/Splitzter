import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; // Recommended: npx expo install expo-haptics
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAppDispatch, useAppSelector } from '@/store';
import { createExpenseThunk } from '@/store/thunks';
import { Expense, Person } from '@/types';

export default function AddExpenseScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const dispatch = useAppDispatch();
  const journey = useAppSelector((state) => state.journey.currentJourney);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaidByMe, setIsPaidByMe] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (journey && currentUser) {
      // Select all participants except current user by default
      setSelected(journey.participants.filter((p: Person) => p.id !== currentUser.id).map((p: Person) => p.id));
    }
  }, [journey, currentUser]);

  const toggleParticipant = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isPaidByMe) {
      // In "I Owe" mode, you usually owe just one person
      setSelected([id]);
    } else {
      setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    }
  };

  const handleToggleMode = (mePaid: boolean) => {
    Haptics.selectionAsync();
    setIsPaidByMe(mePaid);
    // Reset selection to first person if switching to "I Owe"
    if (!mePaid && selected.length > 1) {
      setSelected([selected[0]]);
    }
  };

  const save = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (selected.length === 0) {
      Alert.alert('Missing Info', 'Please select at least one person.');
      return;
    }
    if (!currentUser) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      const expense: Expense = {
        id: `e_${Date.now()}`,
        journeyId: journeyId!,
        title: title.trim() || (isPaidByMe ? 'Shared Expense' : 'Personal Debt'),
        amount: parseFloat(amount),
        paidBy: isPaidByMe ? currentUser!.id : selected[0],
        splitBetween: isPaidByMe ? [currentUser!.id, ...selected] : [currentUser!.id, selected[0]],
        category: 'General',
        date: new Date().toISOString(),
        description: '',
      };

      await dispatch(createExpenseThunk(expense)).unwrap();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  if (!journey) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView 
        style={styles.container} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>New Expense</ThemedText>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Amount Input Section */}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <ThemedText style={styles.currency}>₹</ThemedText>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#E0E0E0"
              autoFocus
            />
          </View>
          <TextInput
            style={styles.titleInput}
            placeholder="What was this for?"
            placeholderTextColor="#A0A0A0"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Mode Switcher */}
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            onPress={() => handleToggleMode(true)} 
            style={[styles.modeBtn, isPaidByMe && styles.modeBtnPaid]}
          >
            <ThemedText style={[styles.modeText, isPaidByMe && styles.textWhite]}>I Paid</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleToggleMode(false)} 
            style={[styles.modeBtn, !isPaidByMe && styles.modeBtnOwe]}
          >
            <ThemedText style={[styles.modeText, !isPaidByMe && styles.textWhite]}>I Owe</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.sectionLabel}>
          {isPaidByMe ? "Split with" : "You owe"}
        </ThemedText>

        {/* Participants Grid */}
        <View style={styles.peopleGrid}>
          {journey.participants.filter(p => p.id !== currentUser?.id).map(p => {
            const isActive = selected.includes(p.id);
            return (
              <TouchableOpacity 
                key={p.id} 
                style={[
                  styles.personCard, 
                  isActive && (isPaidByMe ? styles.cardActivePaid : styles.cardActiveOwe)
                ]} 
                onPress={() => toggleParticipant(p.id)}
              >
                <View style={[styles.avatar, isActive && styles.avatarActive]}>
                  <ThemedText style={[styles.avatarInitial, isActive && styles.textWhite]}>
                    {p.name[0]}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.personName, isActive && styles.textWhite]} numberOfLines={1}>
                  {p.name.split(' ')[0]}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, (!amount || selected.length === 0) && styles.saveDisabled]} 
          onPress={save}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.saveButtonText}>
              Add ₹{amount || '0'}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 40 
  },
  title: { fontSize: 28, fontWeight: '900' },
  closeBtn: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },

  amountSection: { alignItems: 'center', marginBottom: 32 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 32, fontWeight: '600', color: '#007AFF', marginRight: 8 },
  amountInput: { fontSize: 64, fontWeight: '900', color: '#000', minWidth: 80, textAlign: 'center' },
  titleInput: { fontSize: 18, color: '#666', marginTop: 10, fontWeight: '500' },

  modeContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F2F2F7', 
    borderRadius: 16, 
    padding: 4, 
    marginBottom: 32 
  },
  modeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  modeBtnPaid: { backgroundColor: '#34C759' },
  modeBtnOwe: { backgroundColor: '#FF3B30' },
  modeText: { fontWeight: '700', color: '#8E8E93' },
  textWhite: { color: '#fff' },

  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#8E8E93', marginBottom: 16, textAlign: 'center' },

  peopleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  personCard: { 
    width: '30%', 
    paddingVertical: 16, 
    alignItems: 'center', 
    borderRadius: 20, 
    backgroundColor: '#F9F9FB',
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  cardActivePaid: { backgroundColor: '#34C759', borderColor: '#34C759' },
  cardActiveOwe: { backgroundColor: '#FF3B30', borderColor: '#FF3B30' },
  
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#E5E5EA', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  avatarActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  avatarInitial: { fontSize: 18, fontWeight: '800', color: '#8E8E93' },
  personName: { fontSize: 14, fontWeight: '600', color: '#333' },

  footer: { 
    position: 'absolute', 
    bottom: Platform.OS === 'ios' ? 40 : 20, 
    left: 24, 
    right: 24 
  },
  saveButton: { 
    backgroundColor: '#000', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  saveDisabled: { opacity: 0.3 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});