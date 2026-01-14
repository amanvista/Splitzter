import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/lib/database';
import { getCurrentUser } from '@/lib/user-storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        const user = await getCurrentUser();
        
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
        <Stack.Screen name="create-journey" options={{ title: 'Create Journey', presentation: 'modal' }} />
        <Stack.Screen name="add-expense" options={{ title: 'Add Expense', presentation: 'modal' }} />
        <Stack.Screen name="edit-expense/[id]" options={{ title: 'Edit Expense', presentation: 'modal' }} />
        <Stack.Screen name="import-expenses" options={{ title: 'Import Expenses', presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
