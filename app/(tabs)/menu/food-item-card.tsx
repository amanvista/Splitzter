import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

interface FoodItemCardProps {
  item: {
    id: string;
    name: string;
    category: string;
    price: number;
    available: boolean;
    image: string;
    desc: string;
  };
  quantity: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export function FoodItemCard({
  item,
  quantity,
  onUpdateQuantity,
}: FoodItemCardProps) {
  const isSelected = quantity > 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        !item.available && styles.cardDisabled,
        pressed && styles.cardPressed,
      ]}
    >
      {/* IMAGE SECTION */}
      <View style={styles.imageBox}>
        <Image 
          source={item.image}
          style={styles.foodImage}
          contentFit="cover"
        />

        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <ThemedText style={styles.priceText}>₹{item.price}</ThemedText>
        </View>

        {!item.available && (
          <View style={styles.soldOutOverlay}>
            <ThemedText style={styles.soldOutText}>
              OUT OF STOCK
            </ThemedText>
          </View>
        )}
      </View>

      {/* INFO SECTION */}
      <View style={styles.cardInfo}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.itemName} numberOfLines={1}>
            {item.name}
          </ThemedText>

          <ThemedText style={styles.itemDesc} numberOfLines={2}>
            {item.desc}
          </ThemedText>
        </View>

        {/* ACTION AREA */}
        {item.available && (
          <View style={styles.actionArea}>
            {quantity > 0 ? (
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  onPress={() => onUpdateQuantity(item.id, -1)}
                  style={styles.qtyBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="remove" size={18} color="#fff" />
                </TouchableOpacity>

                <ThemedText style={styles.qtyText}>
                  {quantity}
                </ThemedText>

                <TouchableOpacity
                  onPress={() => onUpdateQuantity(item.id, 1)}
                  style={styles.qtyBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, 1)}
                style={styles.fullWidthAddButton}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <ThemedText style={styles.addButtonText}>
                  ADD
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    width: '48%',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(0,150,136,0.05)',
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
  },

  cardDisabled: {
    opacity: 0.6,
  },

  imageBox: {
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  foodImage: {
    width: '100%',
    height: '100%',
  },

  emojiText: {
    fontSize: 48,
  },

  priceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    elevation: 3,
  },

  priceText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  soldOutText: {
    color: '#D32F2F',
    fontWeight: '900',
    fontSize: 12,
  },

  cardInfo: {
    padding: 12,
  },

  textContainer: {
    minHeight: 50,
  },

  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  itemDesc: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
    lineHeight: 14,
  },

  actionArea: {
    marginTop: 12,
  },

  fullWidthAddButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    height: 48,
    elevation: 2,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 4,
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 10,
  },

  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  qtyText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});