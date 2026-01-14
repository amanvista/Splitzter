import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
import { createExpense, getJourneyById } from '@/lib/database';
import { Expense, Journey, Person } from '@/types';

const CURRENT_USER_ID = 'user_1';

export default function AddExpenseScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaidByMe, setIsPaidByMe] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!journeyId) return;
    getJourneyById(journeyId).then(j => {
      if (!j) return;
      setJourney(j);
      setSelected(j.participants.filter((p: Person) => p.id !== CURRENT_USER_ID).map((p: Person) => p.id));
    });
  }, [journeyId]);

  const toggle = (id: string) => {
    if (!isPaidByMe) setSelected([id]);
    else setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const save = async () => {
    if (!amount || selected.length === 0) {
      Alert.alert('Missing info', 'Enter an amount and select people.');
      return;
    }

    setLoading(true);

    try {
      const expense: Expense = {
        id: `e_${Date.now()}`,
        journeyId: journeyId!,
        title: title || (isPaidByMe ? 'Shared Expense' : 'Personal Debt'),
        amount: parseFloat(amount),
        paidBy: isPaidByMe ? CURRENT_USER_ID : selected[0],
        splitBetween: isPaidByMe ? [CURRENT_USER_ID, ...selected] : [CURRENT_USER_ID, selected[0]],
        category: 'General',
        date: new Date().toISOString(),
        description: '',
      };

      await createExpense(expense);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  if (!journey) return null;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        <ThemedText style={styles.title}>New expense</ThemedText>

        {/* Amount */}
        <View style={styles.amountWrap}>
          <ThemedText style={styles.currency}>₹</ThemedText>
          <TextInput
            style={styles.amount}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            autoFocus
          />
        </View>

        <TextInput
          style={styles.note}
          placeholder="What was this for?"
          value={title}
          onChangeText={setTitle}
        />

        {/* Paid / Owe */}
        <View style={styles.toggle}>
          <TouchableOpacity onPress={() => setIsPaidByMe(true)} style={[styles.toggleBtn, isPaidByMe && styles.paid]}>
            <Ionicons name="arrow-up" size={16} color="#fff" />
            <ThemedText style={styles.toggleText}>I Paid</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setIsPaidByMe(false); setSelected([selected[0]]); }} style={[styles.toggleBtn, !isPaidByMe && styles.owe]}>
            <Ionicons name="arrow-down" size={16} color="#fff" />
            <ThemedText style={styles.toggleText}>I Owe</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.label}>
          {isPaidByMe ? "Who should pay you back?" : "Who do you owe?"}
        </ThemedText>

        {/* People */}
        <View style={styles.people}>
          {journey.participants.filter(p => p.id !== CURRENT_USER_ID).map(p => {
            const active = selected.includes(p.id);
            return (
              <TouchableOpacity key={p.id} style={styles.person} onPress={() => toggle(p.id)}>
                <View style={[styles.avatar, active && (isPaidByMe ? styles.avatarPaid : styles.avatarOwe)]}>
                  <ThemedText style={[styles.initial, active && styles.white]}>{p.name[0]}</ThemedText>
                </View>
                <ThemedText style={styles.name}>{p.name.split(' ')[0]}</ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.save} onPress={save}>
          <ThemedText style={styles.saveText}>{loading ? 'Saving...' : `Add ₹${amount || '0'}`}</ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 30 },

  amountWrap: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  currency: { fontSize: 32, color: '#007AFF', marginTop: 12 },
  amount: { fontSize: 72, fontWeight: '900', textAlign: 'center' },

  note: { textAlign: 'center', fontSize: 16, color: '#888', marginBottom: 40 },

  toggle: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 20, padding: 6, marginBottom: 30 },
  toggleBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 16 },
  paid: { backgroundColor: '#34C759' },
  owe: { backgroundColor: '#FF3B30' },
  toggleText: { color: '#fff', fontWeight: '800' },

  label: { textAlign: 'center', color: '#999', fontWeight: '700', marginBottom: 20 },

  people: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginBottom: 40 },
  person: { alignItems: 'center', width: 70 },

  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  avatarPaid: { backgroundColor: '#34C759' },
  avatarOwe: { backgroundColor: '#FF3B30' },

  initial: { fontSize: 20, fontWeight: '800', color: '#999' },
  white: { color: '#fff' },

  name: { marginTop: 6, fontWeight: '600' },

  save: { backgroundColor: '#000', padding: 20, borderRadius: 20, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
