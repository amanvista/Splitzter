import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadJourneys } from '@/store/thunks';

import { EmptyJourneysState } from './EmptyJourneysState';
import { HomeHeader } from './HomeHeader';
import { JourneyGrid } from './JourneyGrid';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { journeys, isLoading } = useAppSelector((state) => state.journey);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      dispatch(loadJourneys()).catch(() => {
        Alert.alert('Error', 'Failed to load journeys');
      });
    }, [dispatch])
  );

  const handleAddJourney = () => {
    router.push('/create-journey');
  };

  return (
    <ThemedView style={styles.container}>
      <HomeHeader onAddJourney={handleAddJourney} isLoading={isLoading} />

      <ThemedView style={styles.content}>
        {journeys.length === 0 ? (
          <EmptyJourneysState />
        ) : (
          <JourneyGrid journeys={journeys} />
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
});
