import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const CURRENT_USER_KEY = '@blinkfeast_current_user';

export const saveCurrentUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) {
      return null;
    }
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error clearing current user:', error);
    throw error;
  }
};
