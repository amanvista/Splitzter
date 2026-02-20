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
  initialRouteName: 'login',
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
        
        setIsReady(true);
        
        // Navigate after component is ready
        setTimeout(() => {
          const inAuthGroup = segments[0] === 'login';
          
          if (!user && !inAuthGroup) {
            // User not logged in, redirect to login
            router.replace('/login/login');
          } else if (user && inAuthGroup) {
            // User logged in but on login screen, redirect to home
            router.replace('/(tabs)');
          } else if (!user) {
            // No user and not on login, go to login
            router.replace('/login/login');
          }
        }, 100);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsReady(true);
        router.replace('/login/login');
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal/modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
        <Stack.Screen name="journey/[id]" />
        <Stack.Screen name="create-journey/create-journey" />
        <Stack.Screen name="add-expense/add-expense" />
        <Stack.Screen name="import-expenses/import-expenses" options={{ title: 'Import Expenses', presentation: 'modal', headerShown: true }} />
        <Stack.Screen name="add-member/add-member" options={{ title: 'Add Member', presentation: 'modal', headerShown: true }} />
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
