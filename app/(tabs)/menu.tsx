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

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'starters', name: 'Starters', icon: 'restaurant-outline' },
  { id: 'main', name: 'Main Course', icon: 'pizza-outline' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream-outline' },
  { id: 'beverages', name: 'Beverages', icon: 'cafe-outline' },
  { id: 'chinese', name: 'Chinese', icon: 'restaurant-outline' },
  { id: 'south-indian', name: 'South Indian', icon: 'nutrition-outline' },
];

const MENU_ITEMS = [
  { id: '1', name: 'Paneer Tikka', category: 'starters', price: 280, available: true, image: '🧆' },
  { id: '2', name: 'Veg Spring Roll', category: 'starters', price: 180, available: true, image: '🥟' },
  { id: '3', name: 'Chicken Wings', category: 'starters', price: 320, available: true, image: '🍗' },
  { id: '4', name: 'Butter Chicken', category: 'main', price: 350, available: true, image: '🍛' },
  { id: '5', name: 'Dal Makhani', category: 'main', price: 250, available: true, image: '🍲' },
  { id: '6', name: 'Biryani', category: 'main', price: 280, available: true, image: '🍚' },
  { id: '7', name: 'Gulab Jamun', category: 'desserts', price: 120, available: true, image: '🍮' },
  { id: '8', name: 'Ice Cream', category: 'desserts', price: 150, available: false, image: '🍨' },
  { id: '9', name: 'Masala Chai', category: 'beverages', price: 40, available: true, image: '☕' },
  { id: '10', name: 'Cold Coffee', category: 'beverages', price: 120, available: true, image: '🥤' },
  { id: '11', name: 'Chilli Chicken', category: 'chinese', price: 300, available: true, image: '🍗' },
  { id: '12', name: 'Fried Rice', category: 'chinese', price: 180, available: true, image: '🍚' },
  { id: '13', name: 'Masala Dosa', category: 'south-indian', price: 120, available: true, image: '🥞' },
  { id: '14', name: 'Idli Sambar', category: 'south-indian', price: 80, available: true, image: '🍘' },
];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientMid, Colors.light.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>Menu</ThemedText>
            <ThemedText style={styles.headerSubtitle}>{filteredItems.length} items available</ThemedText>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.light.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
            placeholderTextColor={Colors.light.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {!isTablet && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mobileTabsContainer}>
          {CATEGORIES.map((category) => (
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
              {CATEGORIES.map((category) => (
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

        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          <View style={styles.menuGrid}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, !item.available && styles.menuCardDisabled]}
                disabled={!item.available}
              >
                <View style={styles.menuImageContainer}>
                  <ThemedText style={styles.menuImage}>{item.image}</ThemedText>
                  {!item.available && (
                    <View style={styles.outOfStockBadge}>
                      <ThemedText style={styles.outOfStockText}>Out</ThemedText>
                    </View>
                  )}
                </View>
                <View style={styles.menuInfo}>
                  <ThemedText style={styles.menuName} numberOfLines={2}>{item.name}</ThemedText>
                  <ThemedText style={styles.menuPrice}>₹{item.price}</ThemedText>
                </View>
                <TouchableOpacity style={[styles.addButton2, !item.available && styles.addButton2Disabled]} disabled={!item.available}>
                  <Ionicons name="add" size={20} color={item.available ? '#fff' : Colors.light.textLight} />
                </TouchableOpacity>
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
  categoryItem: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, marginBottom: 8 },
  categoryItemActive: { backgroundColor: Colors.light.background },
  categoryIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryIconContainerActive: { backgroundColor: Colors.light.primary },
  categoryName: { fontSize: 11, fontWeight: '600', color: Colors.light.textSecondary, textAlign: 'center' },
  categoryNameActive: { color: Colors.light.primary, fontWeight: '700' },
  menuContent: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 24 },
  menuCard: { width: isTablet ? '31%' : '47%', backgroundColor: Colors.light.surface, borderRadius: 16, padding: 12, shadowColor: Colors.light.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  menuCardDisabled: { opacity: 0.5 },
  menuImageContainer: { alignItems: 'center', marginBottom: 8, position: 'relative' },
  menuImage: { fontSize: 48 },
  outOfStockBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: Colors.light.warning, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  outOfStockText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  menuInfo: { marginBottom: 8 },
  menuName: { fontSize: 14, fontWeight: '600', color: Colors.light.text, marginBottom: 4, minHeight: 36 },
  menuPrice: { fontSize: 16, fontWeight: 'bold', color: Colors.light.primary },
  addButton2: { backgroundColor: Colors.light.primary, borderRadius: 8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  addButton2Disabled: { backgroundColor: Colors.light.borderLight },
});
