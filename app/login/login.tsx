import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { saveCurrentUser } from '@/lib/user-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isSecure, setIsSecure] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1500);
    checkBiometricSupport();
    return () => clearTimeout(timer);
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    } catch (error) {
      console.log('Biometric check error:', error);
      setIsBiometricSupported(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Biometrics',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      if (biometricAuth.success) {
        setLoading(true);
        await saveCurrentUser({ id: 'admin_user', name: 'Admin Staff', role: 'admin' });
        router.replace('/(tabs)');
      } else {
        Alert.alert('Authentication Failed', 'Please try again or use Staff ID/PIN');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('POS Access', 'Please enter Staff ID and PIN');
      return;
    }

    if (username !== 'admin' || password !== 'admin') {
      Alert.alert('Invalid Access', 'Credentials do not match our records.');
      return;
    }

    setLoading(true);
    try {
      await saveCurrentUser({ id: 'admin_user', name: 'Admin Staff', role: 'admin' });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'System failed to initialize shift.');
    } finally {
      setLoading(false);
    }
  };

  if (showLoader) {
    return (
      <View style={styles.loaderContainer}>
        <ThemedText style={styles.loaderEmoji}>⚡</ThemedText>
        <ThemedText style={styles.brandName}>BlinkFeast</ThemedText>
        <ActivityIndicator size="small" color="#1a1a1a" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.whiteBackground}>
        <ThemedView style={styles.content}>
          
          {/* Brand Identity */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="flash" size={32} color={Colors.light.primary} />
            </View>
            <ThemedText style={styles.brandNameTitle}>BlinkFeast</ThemedText>
            <ThemedText style={styles.tagline}>Smart POS Terminal #12</ThemedText>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <ThemedText style={styles.loginTitle}>Staff Login</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Staff ID</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter ID"
                  placeholderTextColor="#BBB"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Security PIN</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  placeholder="••••"
                  placeholderTextColor="#BBB"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={isSecure}
                  keyboardType="default"
                />
                <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                  <Ionicons name={isSecure ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <ThemedText style={styles.buttonText}>Start Shift</ThemedText>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Biometric Login Option */}
            {isBiometricSupported && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <ThemedText style={styles.dividerText}>OR</ThemedText>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricAuth}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="finger-print" size={28} color={Colors.light.primary} />
                  <ThemedText style={styles.biometricText}>Login with Biometrics</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>BlinkFeast v2.4.0</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.helpText}>Need help logging in?</ThemedText>
            </TouchableOpacity>
          </View>

        </ThemedView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  whiteBackground: { flex: 1, backgroundColor: '#F8F9FA' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loaderEmoji: { fontSize: 50, marginBottom: 10 },
  brandName: { fontSize: 22, fontWeight: '900', color: '#1a1a1a', marginBottom: 20, letterSpacing: -0.5 },
  
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  brandNameTitle: { fontSize: 32, fontWeight: '900', color: '#1a1a1a', letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#666', marginTop: 4, fontWeight: '500' },

  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  loginTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1a1a1a', // Modern contrast
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700', marginRight: 6 },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  biometricText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: { fontSize: 12, color: '#999', fontWeight: '600' },
  helpText: { fontSize: 14, color: '#1a1a1a', fontWeight: '600', marginTop: 12, textDecorationLine: 'underline' },
});