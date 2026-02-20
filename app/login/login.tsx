import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Theme } from '@/constants/theme';
import { saveCurrentUser } from '@/lib/user-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    if (username !== 'admin' || password !== 'admin') {
      Alert.alert('Error', 'Invalid username or password');
      return;
    }

    setLoading(true);

    try {
      await saveCurrentUser({
        id: 'admin_user',
        name: 'Admin',
        phone: '',
        email: '',
        isFromContacts: false,
      });

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientMid, Colors.light.gradientEnd]}
        style={styles.gradient}
      >
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.logo}>{Theme.branding.logo}</ThemedText>
            <ThemedText style={styles.title}>{Theme.branding.appName}</ThemedText>
            <ThemedText style={styles.subtitle}>
              {Theme.branding.tagline}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Username</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor={Colors.light.textLight}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                returnKeyType="next"
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={Colors.light.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </ThemedView>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Logging in...' : 'Login'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Track expenses • Split bills • Settle up
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
    backgroundColor: 'transparent',
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: Colors.light.textInverse,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textInverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textInverse,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  button: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textInverse,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.textInverse,
    opacity: 0.8,
  },
});
