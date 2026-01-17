import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Journey } from '@/types';


interface JourneyHeaderProps {
  journey: Journey;
  imageUrl: string;
  totalExpenses: number;
  expenseCount: number;
  onBack: () => void;
  onShare: () => void;
}

export function JourneyHeader({
  journey,
  imageUrl,
  totalExpenses,
  expenseCount,
  onBack,
  onShare,
}: JourneyHeaderProps) {
  return (
    <ImageBackground 
      source={{ uri: imageUrl }} 
      style={styles.headerImage}
      imageStyle={styles.headerImageStyle}
    >
      <LinearGradient 
        colors={['rgba(99, 102, 241, 0.85)', 'rgba(139, 92, 246, 0.85)']} 
        style={styles.header}
      >
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
          <ThemedText style={styles.journeyName}>{journey.name}</ThemedText>
          <ThemedText style={styles.mainLabel}>Total Spent</ThemedText>
          <ThemedText style={styles.mainAmount}>₹{totalExpenses.toLocaleString()}</ThemedText>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>{expenseCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Expenses</ThemedText>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNum}>{journey.participants.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Members</ThemedText>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  headerImage: { overflow: 'hidden' },
  headerImageStyle: { borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 30, 
    borderBottomLeftRadius: 36, 
    borderBottomRightRadius: 36 
  },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  iconBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  heroContent: { alignItems: 'center', marginBottom: 25 },
  journeyName: { 
    color: '#fff', 
    fontSize: 14, 
    opacity: 0.95, 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    fontWeight: '600' 
  },
  mainLabel: { color: '#fff', fontSize: 12, opacity: 0.85, marginTop: 8 },
  mainAmount: { color: '#fff', fontSize: 48, fontWeight: '800' },
  
  statsBar: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20, 
    padding: 15 
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#fff', fontSize: 11, opacity: 0.7 },
  statSep: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
});
