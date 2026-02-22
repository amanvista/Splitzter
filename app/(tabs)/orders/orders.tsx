import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const ORDER_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'list-outline' },
  { id: 'pending', name: 'Pending', icon: 'time-outline' },
  { id: 'preparing', name: 'Preparing', icon: 'restaurant-outline' },
  { id: 'ready', name: 'Ready', icon: 'checkmark-circle-outline' },
  { id: 'served', name: 'Served', icon: 'checkmark-done-outline' },
  { id: 'completed', name: 'Completed', icon: 'receipt-outline' },
];

const ORDERS = [
  { id: '1', tableNumber: 2, items: ['Paneer Tikka x2', 'Butter Chicken x1', 'Naan x3'], total: 910, status: 'preparing', time: '10 mins ago', orderNumber: 'ORD-001' },
  { id: '2', tableNumber: 4, items: ['Dal Makhani x2', 'Roti x4', 'Masala Chai x2'], total: 580, status: 'ready', time: '5 mins ago', orderNumber: 'ORD-002' },
  { id: '3', tableNumber: 7, items: ['Veg Spring Roll x1', 'Cold Coffee x2'], total: 420, status: 'pending', time: 'Just now', orderNumber: 'ORD-003' },
  { id: '4', tableNumber: 10, items: ['Biryani x2', 'Raita x2', 'Gulab Jamun x2'], total: 820, status: 'served', time: '15 mins ago', orderNumber: 'ORD-004' },
  { id: '5', tableNumber: 13, items: ['Masala Chai x1', 'Samosa x2'], total: 120, status: 'completed', time: '30 mins ago', orderNumber: 'ORD-005' },
  { id: '6', tableNumber: 5, items: ['Chilli Chicken x1', 'Fried Rice x1'], total: 660, status: 'preparing', time: '8 mins ago', orderNumber: 'ORD-006' },
];

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed';

export default function OrdersScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = ORDERS.filter((order) => {
    const matchesCategory = selectedCategory === 'all' || order.status === selectedCategory;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.tableNumber.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return Colors.light.warning;
      case 'preparing': return Colors.light.secondary;
      case 'ready': return Colors.light.success;
      case 'served': return Colors.light.primary;
      case 'completed': return Colors.light.textLight;
      default: return Colors.light.textLight;
    }
  };

  const pendingCount = ORDERS.filter(o => o.status === 'pending').length;
  const preparingCount = ORDERS.filter(o => o.status === 'preparing').length;

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientMid, Colors.light.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Orders</ThemedText>
            <ThemedText style={styles.headerSubtitle}>{pendingCount} pending • {preparingCount} preparing</ThemedText>
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search order..."
            placeholderTextColor={Colors.light.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {!isTablet && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mobileTabsContainer}>
          {ORDER_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.mobileTab, selectedCategory === category.id && styles.mobileTabActive]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons name={category.icon as any} size={18} color={selectedCategory === category.id ? '#fff' : Colors.light.textSecondary} />
              <ThemedText style={[styles.mobileTabText, selectedCategory === category.id && styles.mobileTabTextActive]}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.mainContent}>
        {isTablet && (
          <View style={styles.sidebar}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {ORDER_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryItem, selectedCategory === category.id && styles.categoryItemActive]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <View style={[styles.categoryIconContainer, selectedCategory === category.id && styles.categoryIconContainerActive]}>
                    <Ionicons name={category.icon as any} size={24} color={selectedCategory === category.id ? '#fff' : Colors.light.textSecondary} />
                  </View>
                  <ThemedText style={[styles.categoryName, selectedCategory === category.id && styles.categoryNameActive]} numberOfLines={2}>
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView style={styles.orderContent} showsVerticalScrollIndicator={false}>
          {filteredOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                  <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>
                  <View style={styles.tableTag}>
                    <Ionicons name="restaurant" size={12} color={Colors.light.primary} />
                    <ThemedText style={styles.tableText}>Table {order.tableNumber}</ThemedText>
                  </View>
                </View>
                <View style={styles.orderHeaderRight}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <ThemedText style={styles.statusText}>{order.status.toUpperCase()}</ThemedText>
                  </View>
                  <ThemedText style={styles.timeText}>{order.time}</ThemedText>
                </View>
              </View>
              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Ionicons name="ellipse" size={6} color={Colors.light.textSecondary} />
                    <ThemedText style={styles.itemText}>{item}</ThemedText>
                  </View>
                ))}
              </View>
              <View style={styles.orderFooter}>
                <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                <ThemedText style={styles.totalAmount}>₹{order.total}</ThemedText>
              </View>
              <View style={styles.actionButtons}>
                {order.status === 'pending' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="play" size={16} color={Colors.light.primary} />
                    <ThemedText style={styles.actionButtonText}>Start</ThemedText>
                  </TouchableOpacity>
                )}
                {order.status === 'preparing' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="checkmark" size={16} color={Colors.light.success} />
                    <ThemedText style={styles.actionButtonText}>Ready</ThemedText>
                  </TouchableOpacity>
                )}
                {order.status === 'ready' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="checkmark-done" size={16} color={Colors.light.primary} />
                    <ThemedText style={styles.actionButtonText}>Served</ThemedText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButtonSecondary}>
                  <Ionicons name="eye-outline" size={16} color={Colors.light.textSecondary} />
                  <ThemedText style={styles.actionButtonTextSecondary}>View</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 20, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  refreshButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  mobileTabsContainer: { backgroundColor: Colors.light.surface, borderBottomWidth: 1, borderBottomColor: Colors.light.border, paddingHorizontal: 16, paddingVertical: 12 },
  mobileTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.light.background, borderWidth: 1, borderColor: Colors.light.border, marginRight: 8 },
  mobileTabActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  mobileTabText: { fontSize: 13, fontWeight: '600', color: Colors.light.textSecondary },
  mobileTabTextActive: { color: '#fff' },
  mainContent: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 120, backgroundColor: Colors.light.surface, borderRightWidth: 1, borderRightColor: Colors.light.border, paddingVertical: 16 },
  categoryItem: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, marginBottom: 8 },
  categoryItemActive: { backgroundColor: Colors.light.background },
  categoryIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryIconContainerActive: { backgroundColor: Colors.light.primary },
  categoryName: { fontSize: 11, fontWeight: '600', color: Colors.light.textSecondary, textAlign: 'center' },
  categoryNameActive: { color: Colors.light.primary, fontWeight: '700' },
  orderContent: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  orderCard: { backgroundColor: Colors.light.surface, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: Colors.light.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderHeaderLeft: { flex: 1 },
  orderNumber: { fontSize: 16, fontWeight: 'bold', color: Colors.light.text, marginBottom: 4 },
  tableTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.light.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  tableText: { fontSize: 12, fontWeight: '600', color: Colors.light.primary },
  orderHeaderRight: { alignItems: 'flex-end' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 4 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  timeText: { fontSize: 11, color: Colors.light.textSecondary },
  orderItems: { gap: 6, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.light.borderLight },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemText: { fontSize: 14, color: Colors.light.textSecondary },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: Colors.light.primary },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.light.background, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.light.primary },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: Colors.light.primary },
  actionButtonSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.light.background, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.light.border },
  actionButtonTextSecondary: { fontSize: 13, fontWeight: '600', color: Colors.light.textSecondary },
});
