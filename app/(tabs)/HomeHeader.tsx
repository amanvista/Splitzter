import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface HomeHeaderProps {
  onAddJourney: () => void;
  isLoading?: boolean;
}

export function HomeHeader({ onAddJourney, isLoading }: HomeHeaderProps) {
  return (
    <LinearGradient
      // Using the same indigo-to-purple logic from your JourneyHeader
      colors={['#6366f1', '#8b5cf6', '#a855f7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.topRow}>
        <View>
          <ThemedText style={styles.brandName}>SPLITZTER</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {isLoading ? 'Syncing data...' : 'Travel. Split. Settle.'}
          </ThemedText>
        </View>
        
        {/* Profile or Icon Placeholder to balance the top row */}
        <TouchableOpacity style={styles.profileIcon}>
           <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {!isLoading && (
        <TouchableOpacity
          style={styles.glassAddButton}
          onPress={onAddJourney}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.buttonInner}
          >
            <Ionicons name="add" size={24} color="#fff" style={styles.icon} />
            <ThemedText style={styles.addButtonText}>Create New Journey</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 35,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // Soft shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4, // Clean, modern brand spacing
    opacity: 0.8,
  },
  headerSubtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  profileIcon: {
    opacity: 0.9,
  },
  glassAddButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});