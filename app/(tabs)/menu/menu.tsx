import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { FoodItemCard } from './food-item-card';
import { styles } from './styles';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

type IconName = keyof typeof Ionicons.glyphMap;

// Enhanced Mock Data with Descriptions
const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid-outline' as IconName },
  { id: 'starters', name: 'Starters', icon: 'restaurant-outline' as IconName },
  { id: 'main', name: 'Mains', icon: 'pizza-outline' as IconName },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream-outline' as IconName },
  { id: 'beverages', name: 'Drinks', icon: 'cafe-outline' as IconName },
];

const MENU_ITEMS = [
  { 
    id: '1', 
    name: 'Paneer Tikka', 
    category: 'starters', 
    price: 280, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop', 
    desc: 'Grilled cottage cheese' 
  },
  { 
    id: '2', 
    name: 'Veg Spring Roll', 
    category: 'starters', 
    price: 180, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop', 
    desc: 'Crispy fried rolls' 
  },
  { 
    id: '3', 
    name: 'Butter Chicken', 
    category: 'main', 
    price: 350, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop', 
    desc: 'Creamy tomato gravy' 
  },
  { 
    id: '4', 
    name: 'Dal Makhani', 
    category: 'main', 
    price: 250, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop', 
    desc: 'Slow cooked lentils' 
  },
  { 
    id: '5', 
    name: 'Gulab Jamun', 
    category: 'desserts', 
    price: 120, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop', 
    desc: 'Deep fried milk balls' 
  },
  { 
    id: '6', 
    name: 'Ice Cream', 
    category: 'desserts', 
    price: 150, 
    available: false, 
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 
    desc: 'Vanilla bean' 
  },
  { 
    id: '7', 
    name: 'Masala Chai', 
    category: 'beverages', 
    price: 40, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop', 
    desc: 'Spiced Indian tea' 
  },
  { 
    id: '8', 
    name: 'Cold Coffee', 
    category: 'beverages', 
    price: 120, 
    available: true, 
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop', 
    desc: 'Frothy & chilled' 
  },
];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const updateQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalAmount = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = MENU_ITEMS.find((i) => i.id === id);
    return total + (item?.price || 0) * qty;
  }, 0);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']} // Darker professional header
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={styles.headerTitle}>BlinkFeast</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Table #12 • Staff: Alex</ThemedText>
          </View>
          <TouchableOpacity style={styles.historyBtn}>
            <Ionicons name="time-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </LinearGradient>

      {/* HORIZONTAL CATEGORIES (Better for Mobile UX) */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
            >
              <Ionicons 
                name={cat.icon} 
                size={18} 
                color={selectedCategory === cat.id ? '#fff' : '#666'} 
              />
              <ThemedText style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive
              ]}>
                {cat.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.menuListContainer}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fast-food-outline" size={64} color="#ddd" />
            <ThemedText style={styles.emptyText}>No items found</ThemedText>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                quantity={cart[item.id] || 0}
                onUpdateQuantity={updateQty}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {totalItems > 0 && (
        <View style={styles.cartSummaryContainer}>
          <LinearGradient
            colors={[Colors.light.primary, '#4a90e2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cartSummary}
          >
            <View>
              <ThemedText style={styles.cartCount}>{totalItems} Items Selected</ThemedText>
              <ThemedText style={styles.cartAmount}>₹{totalAmount}</ThemedText>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
              <ThemedText style={styles.viewOrder}>View Order</ThemedText>
              <Ionicons name="arrow-forward" size={18} color={Colors.light.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </ThemedView>
  );
}
