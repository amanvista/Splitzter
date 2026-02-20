import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { getCurrentUser } from '@/lib/user-storage';
import { setUser } from '@/store/userSlice';
import { store } from '@store';
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
        // Load user from storage into Redux
        const user = await getCurrentUser();
        
        if (user) {
          store.dispatch(setUser(user));
        }
        
        setIsReady(true);
        
        // Navigate after component is ready
        setTimeout(() => {
          const inAuthGroup = segments[0] === 'login';
          
          if (!user && !inAuthGroup) {
            router.replace('/login/login');
          } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
          } else if (!user) {
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
