import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/lib/database';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
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
