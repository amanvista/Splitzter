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

const TABLE_SECTIONS = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'ground', name: 'Ground', icon: 'home-outline' },
  { id: 'first', name: 'First Floor', icon: 'business-outline' },
  { id: 'outdoor', name: 'Outdoor', icon: 'sunny-outline' },
  { id: 'vip', name: 'VIP', icon: 'star-outline' },
  { id: 'bar', name: 'Bar', icon: 'wine-outline' },
];

const TABLES = [
  { id: '1', number: 1, status: 'available', seats: 4, section: 'ground' },
  { id: '2', number: 2, status: 'occupied', seats: 2, orderAmount: 850, section: 'ground' },
  { id: '3', number: 3, status: 'available', seats: 6, section: 'ground' },
  { id: '4', number: 4, status: 'occupied', seats: 4, orderAmount: 1250, section: 'ground' },
  { id: '5', number: 5, status: 'reserved', seats: 8, section: 'first' },
  { id: '6', number: 6, status: 'available', seats: 2, section: 'first' },
  { id: '7', number: 7, status: 'occupied', seats: 4, orderAmount: 650, section: 'first' },
  { id: '8', number: 8, status: 'available', seats: 4, section: 'first' },
  { id: '9', number: 9, status: 'available', seats: 6, section: 'outdoor' },
  { id: '10', number: 10, status: 'occupied', seats: 4, orderAmount: 920, section: 'outdoor' },
  { id: '11', number: 11, status: 'reserved', seats: 10, section: 'vip' },
  { id: '12', number: 12, status: 'available', seats: 6, section: 'vip' },
  { id: '13', number: 13, status: 'occupied', seats: 2, orderAmount: 450, section: 'bar' },
  { id: '14', number: 14, status: 'available', seats: 2, section: 'bar' },
];

type TableStatus = 'available' | 'occupied' | 'reserved';

export default function TablesScreen() {
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = TABLES.filter((table) => {
    const matchesSection = selectedSection === 'all' || table.section === selectedSection;
    const matchesSearch = table.number.toString().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available': return Colors.light.success;
      case 'occupied': return Colors.light.warning;
      case 'reserved': return Colors.light.secondary;
      default: return Colors.light.textLight;
    }
  };

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'available': return 'checkmark-circle';
      case 'occupied': return 'time';
      case 'reserved': return 'bookmark';
      default: return 'help-circle';
    }
  };

  const availableCount = filteredTables.filter(t => t.status === 'available').length;
  const occupiedCount = filteredTables.filter(t => t.status === 'occupied').length;

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientMid, Colors.light.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Tables</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {availableCount} available • {occupiedCount} occupied
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search table..."
            placeholderTextColor={Colors.light.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {!isTablet && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mobileTabsContainer}>
          {TABLE_SECTIONS.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[styles.mobileTab, selectedSection === section.id && styles.mobileTabActive]}
              onPress={() => setSelectedSection(section.id)}
            >
              <Ionicons name={section.icon as any} size={18} color={selectedSection === section.id ? '#fff' : Colors.light.textSecondary} />
              <ThemedText style={[styles.mobileTabText, selectedSection === section.id && styles.mobileTabTextActive]}>
                {section.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.mainContent}>
        {isTablet && (
          <View style={styles.sidebar}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TABLE_SECTIONS.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={[styles.sectionItem, selectedSection === section.id && styles.sectionItemActive]}
                  onPress={() => setSelectedSection(section.id)}
                >
                  <View style={[styles.sectionIconContainer, selectedSection === section.id && styles.sectionIconContainerActive]}>
                    <Ionicons name={section.icon as any} size={24} color={selectedSection === section.id ? '#fff' : Colors.light.textSecondary} />
                  </View>
                  <ThemedText style={[styles.sectionName, selectedSection === section.id && styles.sectionNameActive]} numberOfLines={2}>
                    {section.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView style={styles.tableContent} showsVerticalScrollIndicator={false}>
          <View style={styles.tableGrid}>
            {filteredTables.map((table) => (
              <TouchableOpacity key={table.id} style={[styles.tableCard, { borderColor: getStatusColor(table.status) }]}>
                <View style={styles.tableHeader}>
                  <ThemedText style={styles.tableNumber}>Table {table.number}</ThemedText>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(table.status) }]}>
                    <Ionicons name={getStatusIcon(table.status)} size={12} color="#fff" />
                  </View>
                </View>
                <View style={styles.tableInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={16} color={Colors.light.textSecondary} />
                    <ThemedText style={styles.infoText}>{table.seats} seats</ThemedText>
                  </View>
                  {table.orderAmount && (
                    <View style={styles.infoRow}>
                      <Ionicons name="cash-outline" size={16} color={Colors.light.textSecondary} />
                      <ThemedText style={styles.infoText}>₹{table.orderAmount}</ThemedText>
                    </View>
                  )}
                </View>
                <View style={styles.tableFooter}>
                  <ThemedText style={[styles.statusText, { color: getStatusColor(table.status) }]}>
                    {table.status.toUpperCase()}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  addButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  mobileTabsContainer: { backgroundColor: Colors.light.surface, borderBottomWidth: 1, borderBottomColor: Colors.light.border, paddingHorizontal: 16, paddingVertical: 12 },
  mobileTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.light.background, borderWidth: 1, borderColor: Colors.light.border, marginRight: 8 },
  mobileTabActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  mobileTabText: { fontSize: 13, fontWeight: '600', color: Colors.light.textSecondary },
  mobileTabTextActive: { color: '#fff' },
  mainContent: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 120, backgroundColor: Colors.light.surface, borderRightWidth: 1, borderRightColor: Colors.light.border, paddingVertical: 16 },
  sectionItem: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, marginBottom: 8 },
  sectionItemActive: { backgroundColor: Colors.light.background },
  sectionIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  sectionIconContainerActive: { backgroundColor: Colors.light.primary },
  sectionName: { fontSize: 11, fontWeight: '600', color: Colors.light.textSecondary, textAlign: 'center' },
  sectionNameActive: { color: Colors.light.primary, fontWeight: '700' },
  tableContent: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 24 },
  tableCard: { width: isTablet ? '31%' : '47%', backgroundColor: Colors.light.surface, borderRadius: 16, padding: 16, borderWidth: 2, shadowColor: Colors.light.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tableNumber: { fontSize: 18, fontWeight: 'bold', color: Colors.light.text },
  statusBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tableInfo: { gap: 8, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: Colors.light.textSecondary },
  tableFooter: { paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.light.borderLight },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
