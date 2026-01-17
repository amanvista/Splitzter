import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { getJourneyImageUrl } from '@/lib/journey-images';
import { Journey } from '@/types';

import { JourneyCard } from './JourneyCard';

interface JourneyGridProps {
  journeys: Journey[];
}

export function JourneyGrid({ journeys }: JourneyGridProps) {
  const router = useRouter();

  const renderJourney = useCallback(
    ({ item }: { item: Journey }) => {
      const imageUrl = getJourneyImageUrl(item.id, item.imageUrl);

      return (
        <JourneyCard
          journey={item}
          imageUrl={imageUrl}
          onPress={() => router.push(`/journey/${item.id}`)}
        />
      );
    },
    [router]
  );

  return (
    <FlatList
      data={journeys}
      renderItem={renderJourney}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
});
