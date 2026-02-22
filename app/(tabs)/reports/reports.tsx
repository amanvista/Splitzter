import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

export default function ReportsScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientMid, Colors.light.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Reports</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Today's Summary</ThemedText>
          </View>
          <TouchableOpacity style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.light.primary }]}>
            <Ionicons name="cash-outline" size={32} color="#fff" />
            <ThemedText style={styles.summaryValue}>₹12,450</ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Sales</ThemedText>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: Colors.light.success }]}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
            <ThemedText style={styles.summaryValue}>45</ThemedText>
            <ThemedText style={styles.summaryLabel}>Orders</ThemedText>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: Colors.light.secondary }]}>
            <Ionicons name="people-outline" size={32} color="#fff" />
            <ThemedText style={styles.summaryValue}>128</ThemedText>
            <ThemedText style={styles.summaryLabel}>Customers</ThemedText>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: Colors.light.accent }]}>
            <Ionicons name="trending-up-outline" size={32} color="#fff" />
            <ThemedText style={styles.summaryValue}>₹277</ThemedText>
            <ThemedText style={styles.summaryLabel}>Avg Order</ThemedText>
          </View>
        </View>

        {/* Top Selling Items */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Top Selling Items</ThemedText>
          
          <View style={styles.itemCard}>
            <View style={styles.itemRank}>
              <ThemedText style={styles.rankText}>1</ThemedText>
            </View>
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>Butter Chicken</ThemedText>
              <ThemedText style={styles.itemStats}>24 orders • ₹8,400</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
          </View>

          <View style={styles.itemCard}>
            <View style={styles.itemRank}>
              <ThemedText style={styles.rankText}>2</ThemedText>
            </View>
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>Paneer Tikka</ThemedText>
              <ThemedText style={styles.itemStats}>18 orders • ₹5,040</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
          </View>

          <View style={styles.itemCard}>
            <View style={styles.itemRank}>
              <ThemedText style={styles.rankText}>3</ThemedText>
            </View>
            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>Dal Makhani</ThemedText>
              <ThemedText style={styles.itemStats}>15 orders • ₹3,750</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textLight} />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Payment Methods</ThemedText>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <Ionicons name="cash-outline" size={24} color={Colors.light.success} />
              <ThemedText style={styles.paymentMethod}>Cash</ThemedText>
            </View>
            <ThemedText style={styles.paymentAmount}>₹7,200</ThemedText>
          </View>

          <View style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <Ionicons name="card-outline" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.paymentMethod}>Card</ThemedText>
            </View>
            <ThemedText style={styles.paymentAmount}>₹4,150</ThemedText>
          </View>

          <View style={styles.paymentCard}>
            <View style={styles.paymentLeft}>
              <Ionicons name="phone-portrait-outline" size={24} color={Colors.light.secondary} />
              <ThemedText style={styles.paymentMethod}>UPI</ThemedText>
            </View>
            <ThemedText style={styles.paymentAmount}>₹1,100</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemStats: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});
