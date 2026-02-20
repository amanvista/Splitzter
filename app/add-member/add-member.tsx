import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';
import { getContacts } from '@/lib/contacts';
import { useAppDispatch, useAppSelector } from '@/store';
import { addParticipantToJourneyThunk } from '@/store/thunks';
import { Person } from '@/types';

export default function AddMemberScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId: string }>();
  const dispatch = useAppDispatch();
  const journey = useAppSelector((state) => state.journey.currentJourney);
  const [contacts, setContacts] = useState<Person[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingContacts, setFetchingContacts] = useState(false);
  
  const router = useRouter();

  // Load contacts
  const loadContacts = async () => {
    setFetchingContacts(true);
    try {
      const contactList = await getContacts();
      // Filter out contacts that are already participants
      const existingIds = journey?.participants.map(p => p.id) || [];
      const availableContacts = contactList.filter(contact => !existingIds.includes(contact.id));
      setContacts(availableContacts);
      setFilteredContacts(availableContacts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setFetchingContacts(false);
    }
  };

  useEffect(() => {
    if (showContacts && contacts.length === 0) {
      loadContacts();
    }
  }, [showContacts]);

  // Filter contacts based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const addCustomMember = async () => {
    if (!customName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (!journeyId || !journey) {
      Alert.alert('Error', 'Journey not found');
      return;
    }

    setLoading(true);
    try {
      const newMember: Person = {
        id: `person_${Date.now()}`,
        name: customName.trim(),
        isFromContacts: false,
      };

      await dispatch(addParticipantToJourneyThunk({ journeyId, participant: newMember })).unwrap();
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const addContactMember = async (contact: Person) => {
    if (!journeyId || !journey) {
      Alert.alert('Error', 'Journey not found');
      return;
    }

    setLoading(true);
    try {
      await dispatch(addParticipantToJourneyThunk({ journeyId, participant: contact })).unwrap();
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const renderContact = ({ item }: { item: Person }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => addContactMember(item)}
      activeOpacity={0.7}
    >
      <View style={styles.contactAvatar}>
        <ThemedText style={styles.contactAvatarText}>{item.name[0].toUpperCase()}</ThemedText>
      </View>
      <View style={styles.contactInfo}>
        <ThemedText style={styles.contactName}>{item.name}</ThemedText>
        {item.phone && (
          <ThemedText style={styles.contactPhone}>{item.phone}</ThemedText>
        )}
      </View>
      <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Add Member</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <ThemedText style={styles.headerSubtitle}>
          Add a new member to {journey?.name}
        </ThemedText>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Manual Entry Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Add Manually</ThemedText>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter member name"
              placeholderTextColor={Colors.textSecondary}
              value={customName}
              onChangeText={setCustomName}
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={[styles.addButton, !customName.trim() && styles.addButtonDisabled]}
              onPress={addCustomMember}
              disabled={!customName.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="add" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Contacts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>From Contacts</ThemedText>
            <Switch
              value={showContacts}
              onValueChange={setShowContacts}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={showContacts ? Colors.primary : Colors.textLight}
            />
          </View>

          {showContacts && (
            <>
              {fetchingContacts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <ThemedText style={styles.loadingText}>Loading contacts...</ThemedText>
                </View>
              ) : (
                <>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search contacts..."
                    placeholderTextColor={Colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />

                  {filteredContacts.length === 0 ? (
                    <View style={styles.emptyState}>
                      <ThemedText style={styles.emptyText}>
                        {contacts.length === 0 
                          ? 'No contacts available or all contacts are already members'
                          : 'No contacts match your search'
                        }
                      </ThemedText>
                    </View>
                  ) : (
                    <FlatList
                      data={filteredContacts}
                      renderItem={renderContact}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  placeholder: {
    width: 32,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  addButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});