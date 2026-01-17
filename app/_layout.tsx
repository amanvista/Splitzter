import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { initDatabase } from '@lib/database';
import { store } from '@store';
import { loadCurrentUser } from '@store/thunks';
import { useColorScheme } from '../hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        
        // Load user from storage into Redux
        const result = await store.dispatch(loadCurrentUser());
        const user = result.payload;
        
        // Check if we're in the auth group
        const inAuthGroup = segments[0] === 'login';
        
        if (!user && !inAuthGroup) {
          // User not logged in, redirect to login
          router.replace('/login');
        } else if (user && inAuthGroup) {
          // User logged in but on login screen, redirect to home
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsReady(true);
      }
    };

    initialize();
  }, [segments]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="journey/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="create-journey" options={{ headerShown: false }} />
        <Stack.Screen name="add-expense" options={{ headerShown: false }} />
        <Stack.Screen name="import-expenses" options={{ title: 'Import Expenses', presentation: 'modal' }} />
        <Stack.Screen name="add-member" options={{ title: 'Add Member', presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
