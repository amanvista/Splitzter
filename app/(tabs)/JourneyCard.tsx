import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/colors';
import { Journey } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface JourneyCardProps {
  journey: Journey;
  imageUrl: string;
  onPress: () => void;
}

export function JourneyCard({ journey, imageUrl, onPress }: JourneyCardProps) {
  return (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.cardImage} 
          resizeMode="cover"
        />
      </View>

      <LinearGradient
        // Slightly darker mid-section to help the larger text pop
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.85)']}
        style={styles.cardOverlay}
      >
        <View style={styles.centerContent}>
          <ThemedText style={styles.cardTitle} numberOfLines={2}>
            {journey.name}
          </ThemedText>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.badge}>
            <ThemedText style={styles.cardMetaText}>
              👥 {journey.participants.length}
            </ThemedText>
          </View>
          
          <ThemedText style={styles.dateText}>
            {new Date(journey.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </ThemedText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    width: '48%',
    height: 220, // Increased height slightly to accommodate larger fonts
    borderRadius: 24,
    backgroundColor: Colors.surface,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16, // More padding for a premium feel
    borderRadius: 24,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22, // Significant increase from 18
    fontWeight: '900', // Heavy weight for maximum visibility
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28, // Adjusted for the larger font size
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    letterSpacing: -0.5, // Tighter tracking looks better at large sizes
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cardMetaText: {
    fontSize: 13, // Increased from 11
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 13, // Increased from 11
    fontWeight: '700',
    color: '#FFFFFF', // Changed from gray to white for better visibility on dark gradient
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});