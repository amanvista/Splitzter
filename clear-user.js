// Run this to clear stored user data
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearUser() {
  try {
    await AsyncStorage.removeItem('@splitzter_current_user');
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}

clearUser();
