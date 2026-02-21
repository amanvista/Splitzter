import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  available: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in aromatic spices, served with mint chutney',
    price: 280,
    image: '🧆',
    category: 'Starters',
    rating: 4.5,
    available: true,
  },
  {
    id: '2',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich creamy tomato gravy with aromatic spices',
    price: 350,
    image: '🍛',
    category: 'Main Course',
    rating: 4.8,
    available: true,
  },
  {
    id: '3',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling, served with sambar',
    price: 120,
    image: '🥞',
    category: 'South Indian',
    rating: 4.6,
    available: true,
  },
  {
    id: '4',
    name: 'Biryani',
    description: 'Fragrant basmati rice layered with marinated meat and aromatic spices',
    price: 280,
    image: '🍚',
    category: 'Main Course',
    rating: 4.7,
    available: true,
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    description: 'Deep fried milk balls soaked in sweet rose-flavored syrup',
    price: 120,
    image: '🍮',
    category: 'Desserts',
    rating: 4.4,
    available: true,
  },
  {
    id: '6',
    name: 'Cold Coffee',
    description: 'Frothy chilled coffee blended with ice cream and topped with whipped cream',
    price: 120,
    image: '🥤',
    category: 'Beverages',
    rating: 4.3,
    available: true,
  },
  {
    id: '7',
    name: 'Veg Spring Roll',
    description: 'Crispy fried rolls filled with fresh vegetables and served with sweet chili sauce',
    price: 180,
    image: '🥟',
    category: 'Starters',
    rating: 4.2,
    available: true,
  },
  {
    id: '8',
    name: 'Dal Makhani',
    description: 'Slow cooked black lentils in creamy tomato gravy with butter',
    price: 250,
    image: '🍲',
    category: 'Main Course',
    rating: 4.6,
    available: true,
  },
];

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const quantity = cart[item.id] || 0;

    return (
      <View style={styles.productContainer}>
        {/* Decorative Background Glow */}
        <View style={styles.glowCircle} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.mainGradient}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <ThemedText style={styles.productEmoji}>{item.image}</ThemedText>
          </View>

          {/* Side Actions (Social Style) */}
          <View style={styles.sideActions}>
            <TouchableOpacity style={styles.actionCircle}>
              <Ionicons name="heart-outline" size={26} color="#fff" />
              <ThemedText style={styles.actionText}>Like</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.actionCircle}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <ThemedText style={styles.actionText}>{item.rating}</ThemedText>
            </View>

            <TouchableOpacity style={styles.actionCircle}>
              <Ionicons name="share-social-outline" size={26} color="#fff" />
              <ThemedText style={styles.actionText}>Share</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Content Info */}
          <View style={styles.bottomContent}>
            <View style={styles.glassBadge}>
              <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
            </View>

            <ThemedText style={styles.productName}>{item.name}</ThemedText>
            <ThemedText style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </ThemedText>

            <View style={styles.footerRow}>
              <View>
                <ThemedText style={styles.priceTag}>₹{item.price}</ThemedText>
                <ThemedText style={styles.taxText}>Inc. all taxes</ThemedText>
              </View>

              <TouchableOpacity
                onPress={() => addToCart(item.id)}
                activeOpacity={0.9}
                style={styles.mainAddButton}
              >
                <LinearGradient
                  colors={[Colors.light.primary, '#FF8C00']}
                  style={styles.btnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name={quantity > 0 ? "checkmark" : "add"} size={24} color="#fff" />
                  <ThemedText style={styles.btnText}>
                    {quantity > 0 ? `Added ${quantity}` : 'Add to Cart'}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Vertical Pagination Indicator */}
        <View style={styles.pagination}>
          {PRODUCTS.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      {/* Modern Floating Cart Summary */}
      {Object.keys(cart).length > 0 && (
        <TouchableOpacity style={styles.floatingCart} activeOpacity={0.9}>
          <View style={styles.cartBadge}>
            <ThemedText style={styles.badgeText}>
              {Object.values(cart).reduce((a, b) => a + b, 0)}
            </ThemedText>
          </View>
          <Ionicons name="basket" size={24} color="#fff" />
          <ThemedText style={styles.cartLabel}>View Order</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  productContainer: { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, position: 'relative' },
  
  // Decorative Glow
  glowCircle: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.light.primary,
    opacity: 0.15,
    transform: [{ scale: 1.5 }],
  },

  mainGradient: { flex: 1, paddingHorizontal: 20 },

  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  productEmoji: { fontSize: 160, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 10 }, textShadowRadius: 20 },

  // Side Actions
  sideActions: {
    position: 'absolute',
    right: 15,
    bottom: 220,
    gap: 20,
    alignItems: 'center',
  },
  actionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textShadowColor: '#000',
    textShadowRadius: 4,
  },

  // Content
  bottomContent: {
    paddingBottom: 110,
  },
  glassBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: { color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  productName: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  productDescription: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 20, marginTop: 4, marginBottom: 20 },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: { color: '#fff', fontSize: 30, fontWeight: '900' },
  taxText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '600' },

  mainAddButton: {
    width: '60%',
    height: 58,
    borderRadius: 20,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  // Indicators
  pagination: { position: 'absolute', left: 10, top: '40%', gap: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  activeDot: { height: 20, backgroundColor: Colors.light.primary },

  // Floating Cart
  floatingCart: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: Colors.light.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  cartLabel: { color: '#fff', fontWeight: '800', fontSize: 13 },
});