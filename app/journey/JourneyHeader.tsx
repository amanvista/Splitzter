import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Journey } from '@/types';

interface JourneyHeaderProps {
  journey: Journey;
  imageUrl: string;
  totalExpenses: number;
  expenseCount: number;
  onBack: () => void;
  onShare: () => void;
  onEdit: () => void;
}

export function JourneyHeader({
  journey,
  imageUrl,
  totalExpenses,
  expenseCount,
  onBack,
  onShare,
  onEdit,
}: JourneyHeaderProps) {
  return (
    <ImageBackground 
      source={{ uri: imageUrl }} 
      style={styles.container}
      imageStyle={styles.imageStyle}
    >
      {/* Overlaid Gradient for Text Readability */}
      <LinearGradient 
        colors={['rgba(0,0,0,0.3)', 'rgba(79, 70, 229, 0.7)', 'rgba(124, 58, 237, 0.9)']} 
        style={styles.overlay}
      >
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={onEdit} style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="pencil-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroContent}>
          <ThemedText style={styles.journeyName}>{journey.name}</ThemedText>
          <View style={styles.amountContainer}>
             <ThemedText style={styles.currencySymbol}>₹</ThemedText>
             <ThemedText style={styles.mainAmount}>{totalExpenses.toLocaleString()}</ThemedText>
          </View>
          <ThemedText style={styles.mainLabel}>Overall Expenditure</ThemedText>
        </View>

        <View style={styles.glassStatsBar}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>{expenseCount}</ThemedText>
            <ThemedText style={styles.statLabel}>EXPENSES</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>{journey.participants.length}</ThemedText>
            <ThemedText style={styles.statLabel}>MEMBERS</ThemedText>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 340, // Fixed height for a hero section
    backgroundColor: '#1e1e1e' 
  },
  imageStyle: { 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40 
  },
  overlay: { 
    flex: 1,
    paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 30, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    justifyContent: 'space-between'
  },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  heroContent: { 
    alignItems: 'center',
    marginTop: 10
  },
  journeyName: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.8,
    marginBottom: 4
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
    marginRight: 4
  },
  mainAmount: { 
    color: '#fff', 
    fontSize: 56, 
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  mainLabel: { 
    color: '#fff', 
    fontSize: 14, 
    opacity: 0.7, 
    fontWeight: '500' 
  },
  glassStatsBar: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 24, 
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)', // For web-based viewers
  },
  statBox: { 
    flex: 1, 
    alignItems: 'center' 
  },
  statNum: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '800' 
  },
  statLabel: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '600',
    opacity: 0.6,
    marginTop: 2,
    letterSpacing: 1
  },
  divider: { 
    width: 1, 
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center'
  },
});