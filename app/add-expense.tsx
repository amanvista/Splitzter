import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
import { ThemedView } from '@/components/themed-view';
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
      setSelected(journey.participants.filter((p: Person) => p.id !== currentUser.id).map((p: Person) => p.id));
    }
  }, [journey, currentUser]);

  const toggleParticipant = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isPaidByMe) {
      setSelected([id]);
    } else {
      setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    }
  };

  const handleToggleMode = (mePaid: boolean) => {
    Haptics.selectionAsync();
    setIsPaidByMe(mePaid);
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
    <ThemedView style={styles.container}>
      {/* Brand Consistent Header */}
      <LinearGradient colors={['#6366f1', '#8b5cf6', '#a855f7']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Add Expense</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <ThemedText style={styles.headerSubtitle}>{journey.name}</ThemedText>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Amount Input */}
          <View style={styles.amountContainer}>
            <View style={styles.amountRow}>
              <ThemedText style={styles.currencySymbol}>₹</ThemedText>
              <TextInput
                style={styles.mainAmountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#CBD5E1"
                autoFocus
              />
            </View>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What was this for?"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Mode Switcher - Custom Styled */}
          <View style={styles.modeToggle}>
            <TouchableOpacity 
              onPress={() => handleToggleMode(true)} 
              style={[styles.modeOption, isPaidByMe && styles.modeActive]}
            >
              <ThemedText style={[styles.modeLabel, isPaidByMe && styles.modeLabelActive]}>I Paid</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleToggleMode(false)} 
              style={[styles.modeOption, !isPaidByMe && styles.modeActive]}
            >
              <ThemedText style={[styles.modeLabel, !isPaidByMe && styles.modeLabelActive]}>I Owe</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.sectionHeading}>
            {isPaidByMe ? "SPLIT WITH" : "WHO DO YOU OWE?"}
          </ThemedText>

          {/* Modern Participant Grid */}
          <View style={styles.grid}>
            {journey.participants.filter(p => p.id !== currentUser?.id).map(p => {
              const isActive = selected.includes(p.id);
              return (
                <TouchableOpacity 
                  key={p.id} 
                  activeOpacity={0.7}
                  style={[styles.personCard, isActive && styles.personCardActive]} 
                  onPress={() => toggleParticipant(p.id)}
                >
                  <View style={[styles.avatarCircle, isActive && styles.avatarCircleActive]}>
                    <ThemedText style={[styles.avatarInitial, isActive && { color: '#fff' }]}>
                      {p.name[0]}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.personLabel, isActive && { color: '#fff' }]} numberOfLines={1}>
                    {p.name.split(' ')[0]}
                  </ThemedText>
                  {isActive && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={save} disabled={loading || !amount} style={styles.saveBtnWrapper}>
            <LinearGradient
              colors={['#6366f1', '#a855f7']}
              start={{x:0, y:0}} end={{x:1, y:0}}
              style={[styles.saveGradient, (!amount || selected.length === 0) && { opacity: 0.5 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.saveBtnText}>
                  Confirm ₹{amount || '0'}
                </ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 35, 
    paddingHorizontal: 24, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40 
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: '#fff', opacity: 0.8, textAlign: 'center', marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' },

  scrollContent: { padding: 24 },
  amountContainer: { alignItems: 'center', marginBottom: 32 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 32, fontWeight: '700', color: '#6366f1', marginRight: 4, marginTop: 10 },
  mainAmountInput: { fontSize: 64, fontWeight: '900', color: '#1E293B', minWidth: 100, textAlign: 'center' },
  descriptionInput: { fontSize: 18, color: '#475569', marginTop: 8, fontWeight: '600', width: '100%', textAlign: 'center' },

  modeToggle: { 
    flexDirection: 'row', 
    backgroundColor: '#E2E8F0', 
    borderRadius: 20, 
    padding: 6, 
    marginBottom: 32 
  },
  modeOption: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 16 },
  modeActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  modeLabel: { fontWeight: '700', color: '#64748B', fontSize: 15 },
  modeLabelActive: { color: '#6366f1' },

  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#94A3B8', marginBottom: 16, letterSpacing: 1.5, textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  personCard: { 
    width: '31%', 
    paddingVertical: 20, 
    alignItems: 'center', 
    borderRadius: 24, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative'
  },
  personCardActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  
  avatarCircle: { width: 48, height: 48, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarCircleActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  avatarInitial: { fontSize: 18, fontWeight: '800', color: '#64748B' },
  personLabel: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  checkIcon: { position: 'absolute', top: 8, right: 8 },

  footer: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 20, left: 24, right: 24 },
  saveBtnWrapper: { borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  saveGradient: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
});