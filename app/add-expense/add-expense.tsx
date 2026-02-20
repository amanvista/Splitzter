import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
  View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store';
import { createExpenseThunk, updateExpenseThunk } from '@/store/thunks';
import { Expense } from '@/types';

// Define Categories
const CATEGORIES = [
  { id: 'Food', label: 'Food', icon: 'fast-food-outline' },
  { id: 'Transport', label: 'Travel', icon: 'car-outline' },
  { id: 'Stay', label: 'Stay', icon: 'bed-outline' },
  { id: 'Party', label: 'Party', icon: 'wine-outline' },
  { id: 'Activities', label: 'Activity', icon: 'ticket-outline' },
  { id: 'Shopping', label: 'Shopping', icon: 'cart-outline' },
  { id: 'Settlement', label: 'Settlement', icon: 'checkmark-circle-outline' },
  { id: 'Other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
] as const;

type SplitMode = 'everyone' | 'selective';

export default function AddExpenseScreen() {
  const { journeyId, expenseId } = useLocalSearchParams<{ journeyId: string; expenseId?: string }>();
  const dispatch = useAppDispatch();
  const journey = useAppSelector((state) => state.journey.currentJourney);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const expenses = useAppSelector((state) => 
    journeyId ? state.expense.expenses[journeyId] || [] : []
  );
  
  // Check if we're editing an existing expense
  const isEditing = !!expenseId;
  const existingExpense = isEditing ? expenses.find(e => e.id === expenseId) : null;
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Food');
  const [paidBy, setPaidBy] = useState<string>(currentUser?.id || '');
  const [splitMode, setSplitMode] = useState<SplitMode>('everyone');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Load existing expense data when editing
  useEffect(() => {
    if (existingExpense) {
      setTitle(existingExpense.title);
      setAmount(existingExpense.amount.toString());
      setSelectedCategory(existingExpense.category || 'Food');
      setPaidBy(existingExpense.paidBy);
      setSelectedParticipants(existingExpense.splitBetween);
      setSplitMode(existingExpense.splitBetween.length === journey?.participants.length ? 'everyone' : 'selective');
    }
  }, [existingExpense, journey]);

  useEffect(() => {
    if (journey && !isEditing) {
      setSelectedParticipants(journey.participants.map(p => p.id));
    }
  }, [journey, isEditing]);

  const handleCategorySelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(id);
  };

  const handleToggleParticipant = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setSplitMode('selective');
  };

  const save = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      if (isEditing && existingExpense) {
        // Update existing expense
        const updatedExpense: Expense = {
          ...existingExpense,
          title: title.trim() || `${selectedCategory} Expense`,
          amount: parseFloat(amount),
          paidBy: paidBy,
          splitBetween: selectedParticipants,
          category: selectedCategory,
          description: existingExpense.description || '',
        };

        await dispatch(updateExpenseThunk(updatedExpense)).unwrap();
      } else {
        // Create new expense
        const expense: Expense = {
          id: `e_${Date.now()}`,
          journeyId: journeyId!,
          title: title.trim() || `${selectedCategory} Expense`,
          amount: parseFloat(amount),
          paidBy: paidBy,
          splitBetween: selectedParticipants,
          category: selectedCategory,
          date: new Date().toISOString(),
          description: '',
        };

        await dispatch(createExpenseThunk(expense)).unwrap();
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'save'} expense`);
    } finally {
      setLoading(false);
    }
  };

  if (!journey) return null;

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#6366f1', '#8b5cf6', '#a855f7']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{isEditing ? 'Edit Expense' : 'Add Expense'}</ThemedText>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* 1. Hero Amount & Name */}
          <View style={styles.heroSection}>
            <View style={styles.amountRow}>
              <ThemedText style={styles.currencySymbol}>₹</ThemedText>
              <TextInput
                style={styles.mainAmountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0"
                autoFocus
              />
            </View>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What was this for?"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 2. Category Picker */}
          <ThemedText style={styles.sectionHeading}>CATEGORY</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalPicker}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => handleCategorySelect(cat.id)}
                style={[styles.categoryChip, selectedCategory === cat.id && styles.activeCategoryChip]}
              >
                <Ionicons name={cat.icon} size={18} color={selectedCategory === cat.id ? '#fff' : '#64748B'} />
                <ThemedText style={[styles.categoryText, selectedCategory === cat.id && styles.whiteText]}>
                  {cat.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 3. Paid By Selector */}
          <ThemedText style={styles.sectionHeading}>PAID BY</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalPicker}>
            {journey.participants.map(p => (
              <TouchableOpacity 
                key={p.id} 
                onPress={() => { setPaidBy(p.id); Haptics.selectionAsync(); }}
                style={[styles.payerChip, paidBy === p.id && styles.activePayerChip]}
              >
                <ThemedText style={[styles.payerText, paidBy === p.id && styles.whiteText]}>
                  {p.id === currentUser?.id ? 'Me' : p.name.split(' ')[0]}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 4. Split Mode & Grid */}
          <ThemedText style={styles.sectionHeading}>SPLIT WITH</ThemedText>
          <View style={styles.splitModeContainer}>
            <TouchableOpacity 
              onPress={() => { setSplitMode('everyone'); setSelectedParticipants(journey.participants.map(p=>p.id)); }}
              style={[styles.modeTab, splitMode === 'everyone' && styles.activeTab]}
            >
              <ThemedText style={[styles.tabText, splitMode === 'everyone' && styles.activeTabText]}>Everyone</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSplitMode('selective')}
              style={[styles.modeTab, splitMode === 'selective' && styles.activeTab]}
            >
              <ThemedText style={[styles.tabText, splitMode === 'selective' && styles.activeTabText]}>Selective</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {journey.participants.map(p => {
              const isActive = selectedParticipants.includes(p.id);
              return (
                <TouchableOpacity 
                  key={p.id} 
                  style={[styles.personCard, isActive && styles.activeCard]} 
                  onPress={() => handleToggleParticipant(p.id)}
                >
                  <View style={[styles.avatar, isActive && styles.activeAvatar]}>
                    <ThemedText style={[styles.avatarText, isActive && styles.whiteText]}>{p.name[0]}</ThemedText>
                  </View>
                  <ThemedText style={[styles.personName, isActive && styles.whiteText]} numberOfLines={1}>{p.name.split(' ')[0]}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={save} style={styles.saveWrapper}>
            <LinearGradient colors={['#6366f1', '#a855f7']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.saveBtn}>
              <ThemedText style={styles.saveText}>{isEditing ? 'Update' : 'Save'} ₹{amount || '0'}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  
  scrollContent: { padding: 24 },
  heroSection: { alignItems: 'center', marginBottom: 25 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 32, fontWeight: '700', color: '#6366f1', marginRight: 4 },
  mainAmountInput: { fontSize: 56, fontWeight: '900', color: '#1E293B', textAlign: 'center', minWidth: 100 },
  descriptionInput: { fontSize: 18, color: '#475569', marginTop: 10, textAlign: 'center', fontWeight: '600' },

  sectionHeading: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  horizontalPicker: { marginBottom: 25, marginHorizontal: -24, paddingHorizontal: 24 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 10, borderWidth: 1, borderColor: '#CBD5E1' },
  activeCategoryChip: { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' },
  categoryText: { fontWeight: '700', color: '#64748B', fontSize: 13 },

  payerChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 10 },
  activePayerChip: { backgroundColor: '#6366f1' },
  payerText: { fontWeight: '700', color: '#64748B', fontSize: 13 },

  splitModeContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 15, padding: 4, marginBottom: 20 },
  modeTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#fff' },
  tabText: { fontWeight: '700', color: '#64748B', fontSize: 13 },
  activeTabText: { color: '#6366f1' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  personCard: { width: '31%', paddingVertical: 15, alignItems: 'center', borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F1F5F9' },
  activeCard: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  activeAvatar: { backgroundColor: 'rgba(255,255,255,0.2)' },
  avatarText: { fontWeight: '800', color: '#64748B' },
  personName: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  whiteText: { color: '#fff' },

  footer: { position: 'absolute', bottom: 30, left: 24, right: 24 },
  saveWrapper: { borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#6366f1', shadowOpacity: 0.3, shadowRadius: 10 },
  saveBtn: { paddingVertical: 20, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});