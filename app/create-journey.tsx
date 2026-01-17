import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getContacts } from '@/lib/contacts';
import { getRandomJourneyImage } from '@/lib/journey-images';
import { useAppDispatch, useAppSelector } from '@/store';
import { createJourney } from '@/store/thunks';
import { Journey, Person } from '@/types';

export default function CreateJourneyScreen() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [journeyName, setJourneyName] = useState('');
  const [journeyDescription, setJourneyDescription] = useState('');
  const [contacts, setContacts] = useState<Person[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<Person[]>([]);
  const [customName, setCustomName] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingContacts, setFetchingContacts] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    if (currentUser && selectedParticipants.length === 0) {
      setSelectedParticipants([currentUser]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (showContacts && contacts.length === 0) {
      loadContacts();
    }
  }, [showContacts]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    setFetchingContacts(true);
    try {
      const contactList = await getContacts();
      const sorted = contactList.sort((a, b) => a.name.localeCompare(b.name));
      setContacts(sorted);
      setFilteredContacts(sorted);
    } catch (error) {
      Alert.alert('Permission Denied', 'Please enable contacts access in your settings.');
    } finally {
      setFetchingContacts(false);
    }
  };

  const addCustomParticipant = () => {
    if (customName.trim()) {
      const newPerson: Person = {
        id: `custom_${Date.now()}`,
        name: customName.trim(),
        isFromContacts: false,
      };
      setSelectedParticipants([...selectedParticipants, newPerson]);
      setCustomName('');
    }
  };

  const toggleParticipant = (person: Person) => {
    const isSelected = selectedParticipants.some(p => p.id === person.id);
    if (isSelected) {
      if (currentUser && person.id === currentUser.id) {
        Alert.alert('Cannot Remove', 'You cannot remove yourself');
        return;
      }
      setSelectedParticipants(selectedParticipants.filter(p => p.id !== person.id));
    } else {
      setSelectedParticipants([...selectedParticipants, person]);
    }
  };

  const createNewJourney = async () => {
    if (!journeyName.trim()) {
      Alert.alert('Error', 'Please enter a journey name');
      return;
    }
    setLoading(true);
    try {
      const journey: Journey = {
        id: `journey_${Date.now()}`,
        name: journeyName.trim(),
        description: journeyDescription.trim(),
        imageUrl: getRandomJourneyImage(),
        createdAt: new Date().toISOString(),
        participants: selectedParticipants,
      };
      await dispatch(createJourney(journey)).unwrap();
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create journey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Premium Gradient Header */}
      <LinearGradient colors={['#6366f1', '#8b5cf6', '#a855f7']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>New Journey</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <ThemedText style={styles.headerSubtitle}>Set up your travel crew</ThemedText>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Trip Details Card */}
        <View style={styles.card}>
          <ThemedText style={styles.label}>Trip Info</ThemedText>
          <TextInput
            style={styles.input}
            value={journeyName}
            onChangeText={setJourneyName}
            placeholder="Goa Trip 2026..."
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={journeyDescription}
            onChangeText={setJourneyDescription}
            placeholder="Add a short description (optional)"
            placeholderTextColor="#94A3B8"
            multiline
          />
        </View>

        {/* Add People Section */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Participants</ThemedText>
          
          <View style={styles.addCustomRow}>
            <TextInput
              style={styles.customInput}
              value={customName}
              onChangeText={setCustomName}
              placeholder="Add name manually..."
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addCustomParticipant}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.toggleRow}>
            <ThemedText style={styles.toggleText}>Sync Phone Contacts</ThemedText>
            <Switch 
              value={showContacts} 
              onValueChange={setShowContacts}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={showContacts ? '#6366F1' : '#F8FAFC'}
            />
          </View>

          {/* Selected horizontal chips */}
          {selectedParticipants.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {selectedParticipants.map(p => (
                <View key={p.id} style={styles.chip}>
                  <ThemedText style={styles.chipText}>{p.name}</ThemedText>
                  <TouchableOpacity onPress={() => toggleParticipant(p)}>
                    <Ionicons name="close-circle" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {showContacts && (
            <View style={styles.contactsBox}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#94A3B8" />
                <TextInput 
                  placeholder="Search contacts..." 
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              {fetchingContacts ? (
                <ActivityIndicator style={{ margin: 20 }} color="#8b5cf6" />
              ) : (
                <View>
                  {filteredContacts.slice(0, 10).map(item => {
                    const isSelected = selectedParticipants.some(p => p.id === item.id);
                    return (
                      <TouchableOpacity 
                        key={item.id} 
                        style={styles.contactItem}
                        onPress={() => toggleParticipant(item)}
                      >
                        <View style={[styles.avatar, isSelected && styles.avatarActive]}>
                          <ThemedText style={[styles.avatarText, isSelected && { color: '#fff' }]}>
                            {item.name[0]}
                          </ThemedText>
                        </View>
                        <ThemedText style={[styles.contactName, isSelected && { fontWeight: '700' }]}>
                          {item.name}
                        </ThemedText>
                        <Ionicons 
                          name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                          size={24} 
                          color={isSelected ? "#6366F1" : "#CBD5E1"} 
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Floating Style Action Button */}
        <TouchableOpacity style={styles.mainBtn} onPress={createNewJourney} disabled={loading}>
          <LinearGradient 
            colors={['#6366f1', '#a855f7']} 
            start={{x:0, y:0}} end={{x:1, y:0}}
            style={styles.btnGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.mainBtnText}>Initialize Journey</ThemedText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 35, 
    paddingHorizontal: 24, 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40 
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.8, marginTop: 8, textAlign: 'center' },
  
  content: { flex: 1, padding: 20 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  section: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '800', color: '#94A3B8', marginBottom: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  
  input: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 16, marginBottom: 12, color: '#1E293B', borderWidth: 1, borderColor: '#F1F5F9' },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  addCustomRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  customInput: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  addBtn: { backgroundColor: '#8b5cf6', width: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  toggleText: { fontSize: 15, color: '#475569', fontWeight: '600' },
  
  chipScroll: { marginBottom: 16 },
  chip: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', 
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, marginRight: 8, gap: 6,
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
  chipText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  
  contactsBox: { backgroundColor: '#fff', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, padding: 12, fontSize: 14 },
  
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 16, marginBottom: 4 },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarActive: { backgroundColor: '#6366F1' },
  avatarText: { fontWeight: '800', color: '#94A3B8', fontSize: 16 },
  contactName: { flex: 1, fontSize: 15, color: '#1E293B' },

  mainBtn: { marginTop: 10, borderRadius: 20, overflow: 'hidden' },
  btnGradient: { padding: 18, alignItems: 'center', justifyContent: 'center' },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 }
});