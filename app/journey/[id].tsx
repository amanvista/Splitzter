import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ShareModal } from '@/components/share-modal';
import { ThemedText } from '@/components/themed-text';
import { calculateJourneyBalance } from '@/lib/calculations';
import {
  deleteExpense,
  getJourneyById,
  getJourneyExpenses
} from '@/lib/database';
import { Expense, Journey, JourneyBalance, Person, Settlement } from '@/types';

// Professional Slate/Indigo Palette
const THEME = {
  primary: '#6366F1', // Indigo
  secondary: '#8B5CF6', // Violet
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textMuted: '#64748B',
  success: '#10B981',
  error: '#EF4444',
  border: '#E2E8F0',
};

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

  useFocusEffect(useCallback(() => { loadJourneyData(); }, [id]));

  const getPersonName = (personId: string) => 
    journey?.participants.find(p => p.id === personId)?.name || 'Unknown';

  const confirmDelete = (expense: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              loadJourneyData(); // Refresh list and totals
            } catch (error) {
              Alert.alert('Error', 'Could not delete expense');
            }
          } 
        },
      ]
    );
  };

  const renderExpense = (item: Expense) => (
    <View key={item.id} style={styles.expenseWrapper}>
      <TouchableOpacity
        style={styles.expenseCard}
        onPress={() => router.push(`/edit-expense/${item.id}`)}
        activeOpacity={0.6}
      >
        <View style={styles.expenseIconWrapper}>
          <Ionicons name="card-outline" size={20} color={THEME.primary} />
        </View>
        <View style={styles.expenseMain}>
          <ThemedText style={styles.expenseTitle} numberOfLines={1}>{item.title}</ThemedText>
          <ThemedText style={styles.expenseSub}>Paid by {getPersonName(item.paidBy)}</ThemedText>
        </View>
        <View style={styles.expenseRight}>
          <ThemedText style={styles.expenseAmount}>₹{item.amount.toLocaleString()}</ThemedText>
          <ThemedText style={styles.expenseDate}>
            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </ThemedText>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={() => confirmDelete(item)}
        activeOpacity={0.5}
      >
        <Ionicons name="trash-outline" size={20} color={THEME.error} />
      </TouchableOpacity>
    </View>
  );

  if (!journey) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <LinearGradient colors={[THEME.primary, THEME.secondary]} style={styles.header}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowShareModal(true)} style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <ThemedText style={styles.journeyName}>{journey.name}</ThemedText>
            <ThemedText style={styles.mainLabel}>Total Spent</ThemedText>
            <ThemedText style={styles.mainAmount}>₹{balance?.totalExpenses.toLocaleString()}</ThemedText>
          </View>

          <View style={styles.statsBar}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statNum}>{expenses.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Expenses</ThemedText>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statBox}>
              <ThemedText style={styles.statNum}>{journey.participants.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Members</ThemedText>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.btnPrimary} 
              onPress={() => router.push(`/add-expense?journeyId=${id}`)}
            >
              <Ionicons name="add" size={22} color="#fff" />
              <ThemedText style={styles.btnTextPrimary}>Add Expense</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.btnSecondary}
              onPress={() => router.push(`/import-expenses?journeyId=${id}`)}
            >
              <Ionicons name="scan-outline" size={20} color={THEME.primary} />
            </TouchableOpacity>
          </View>

          {/* Settlements */}
          {balance?.settlements && balance.settlements.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionHeader}>Suggested Payments</ThemedText>
              <View style={styles.settleBox}>
                {balance.settlements.map((s: Settlement, i: number) => (
                  <View key={i} style={styles.settleRow}>
                    <View style={styles.settleIcon}><Ionicons name="arrow-forward" size={14} color="#fff" /></View>
                    <ThemedText style={styles.settleText}>
                      <ThemedText style={styles.bold}>{getPersonName(s.from)}</ThemedText> owes <ThemedText style={styles.bold}>{getPersonName(s.to)}</ThemedText>
                    </ThemedText>
                    <ThemedText style={styles.settleAmount}>₹{s.amount.toLocaleString()}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Balances */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionHeader}>Group Balances</ThemedText>
            <View style={styles.card}>
              {journey.participants.map((p: Person) => {
                const bal = balance?.balances[p.id] || 0;
                return (
                  <View key={p.id} style={styles.pRow}>
                    <View style={styles.pAvatar}><ThemedText style={styles.pAvatarText}>{p.name[0]}</ThemedText></View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.pName}>{p.name}</ThemedText>
                      <ThemedText style={[styles.pStatus, bal < 0 ? { color: THEME.success } : bal > 0 ? { color: THEME.error } : {}]}>
                        {bal < 0 ? 'is owed' : bal > 0 ? 'owes' : 'settled up'}
                      </ThemedText>
                    </View>
                    <ThemedText style={[styles.pAmount, bal < 0 ? { color: THEME.success } : bal > 0 ? { color: THEME.error } : {}]}>
                      {bal === 0 ? '—' : `₹${Math.abs(bal).toLocaleString()}`}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Activity */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionHeader}>Activity</ThemedText>
            {expenses.length === 0 ? (
              <View style={styles.empty}><ThemedText style={styles.emptyText}>Nothing recorded yet</ThemedText></View>
            ) : (
              expenses.map(renderExpense)
            )}
          </View>
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
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroContent: { alignItems: 'center', marginBottom: 25 },
  journeyName: { color: '#fff', fontSize: 14, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  mainLabel: { color: '#fff', fontSize: 12, opacity: 0.7, marginTop: 8 },
  mainAmount: { color: '#fff', fontSize: 48, fontWeight: '800' },
  
  statsBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 15 },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#fff', fontSize: 11, opacity: 0.7 },
  statSep: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  body: { paddingHorizontal: 20, paddingBottom: 40 },
  actionRow: { flexDirection: 'row', marginTop: -25, gap: 12, marginBottom: 30 },
  btnPrimary: { flex: 1, backgroundColor: THEME.primary, height: 56, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  btnTextPrimary: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnSecondary: { width: 56, height: 56, backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME.border },

  section: { marginBottom: 30 },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: THEME.text, marginBottom: 15 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: THEME.border },
  
  pRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  pAvatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  pAvatarText: { fontSize: 16, fontWeight: '700', color: THEME.textMuted },
  pName: { fontSize: 16, fontWeight: '600', color: THEME.text },
  pStatus: { fontSize: 12, color: THEME.textMuted, marginTop: 2 },
  pAmount: { fontSize: 16, fontWeight: '700' },

  settleBox: { backgroundColor: '#EEF2FF', borderRadius: 24, padding: 20, borderLeftWidth: 5, borderLeftColor: THEME.primary },
  settleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  settleIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: THEME.primary, alignItems: 'center', justifyContent: 'center' },
  settleText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#4338CA' },
  settleAmount: { fontSize: 15, fontWeight: '800', color: THEME.primary },

  expenseWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  expenseCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: THEME.border },
  expenseIconWrapper: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  expenseMain: { flex: 1 },
  expenseTitle: { fontSize: 15, fontWeight: '700', color: THEME.text },
  expenseSub: { fontSize: 12, color: THEME.textMuted, marginTop: 3 },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { fontSize: 16, fontWeight: '700', color: THEME.text },
  expenseDate: { fontSize: 10, color: THEME.textMuted, marginTop: 4 },

  deleteBtn: { width: 48, height: 56, backgroundColor: '#FFF5F5', borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  
  bold: { fontWeight: '700' },
  empty: { padding: 30, alignItems: 'center' },
  emptyText: { color: THEME.textMuted, fontSize: 14 }
});