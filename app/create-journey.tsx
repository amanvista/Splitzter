import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { createJourney } from '@/lib/database';
import { Journey, Person } from '@/types';

export default function CreateJourneyScreen() {
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

  // Load contacts only when the switch is toggled to improve initial performance
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
      // Sort alphabetically
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
    if (selectedParticipants.length === 0) {
      Alert.alert('Error', 'Add at least one person to split with');
      return;
    }

    setLoading(true);
    try {
      const journey: Journey = {
        id: `journey_${Date.now()}`,
        name: journeyName.trim(),
        description: journeyDescription.trim(),
        createdAt: new Date().toISOString(),
        participants: selectedParticipants,
      };
      await createJourney(journey);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create journey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <ThemedText style={styles.headerTitle}>New Journey</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Who are you traveling with?</ThemedText>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <ThemedText style={styles.label}>Trip Details</ThemedText>
          <TextInput
            style={styles.input}
            value={journeyName}
            onChangeText={setJourneyName}
            placeholder="e.g. Goa Trip 2024"
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={journeyDescription}
            onChangeText={setJourneyDescription}
            placeholder="What's the plan? (Optional)"
            placeholderTextColor="#94A3B8"
            multiline
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Add People</ThemedText>
          
          <View style={styles.addCustomRow}>
            <TextInput
              style={styles.customInput}
              value={customName}
              onChangeText={setCustomName}
              placeholder="Name"
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addCustomParticipant}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.toggleRow}>
            <ThemedText style={styles.toggleText}>Import from contacts</ThemedText>
            <Switch 
              value={showContacts} 
              onValueChange={setShowContacts}
              trackColor={{ false: '#CBD5E1', true: '#A5B4FC' }}
              thumbColor={showContacts ? '#6366F1' : '#F8FAFC'}
            />
          </View>

          {/* Selected horizontal chips */}
          {selectedParticipants.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {selectedParticipants.map(p => (
                <View key={p.id} style={styles.chip}>
                  <ThemedText style={styles.chipText}>{p.name}</ThemedText>
                  <TouchableOpacity onPress={() => setSelectedParticipants(prev => prev.filter(x => x.id !== p.id))}>
                    <Ionicons name="close-circle" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {showContacts && (
            <View style={styles.contactsBox}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#64748B" />
                <TextInput 
                  placeholder="Search contacts..." 
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              {fetchingContacts ? (
                <ActivityIndicator style={{ margin: 20 }} color="#6366F1" />
              ) : (
                <View>
                  {filteredContacts.slice(0, 15).map(item => {
                    const isSelected = selectedParticipants.some(p => p.id === item.id);
                    return (
                      <TouchableOpacity 
                        key={item.id} 
                        style={styles.contactItem}
                        onPress={() => toggleParticipant(item)}
                      >
                        <View style={[styles.avatar, isSelected && styles.avatarActive]}>
                          <ThemedText style={styles.avatarText}>{item.name[0]}</ThemedText>
                        </View>
                        <ThemedText style={styles.contactName}>{item.name}</ThemedText>
                        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#10B981" />}
                      </TouchableOpacity>
                    );
                  })}
                  {filteredContacts.length > 15 && (
                    <ThemedText style={styles.limitText}>Keep typing to find more...</ThemedText>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={createNewJourney} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.mainBtnText}>Create Journey</ThemedText>}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.8, marginTop: 4 },
  
  content: { flex: 1, padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  section: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 12, textTransform: 'uppercase' },
  
  input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12, color: '#1E293B' },
  textArea: { height: 100, textAlignVertical: 'top' },
  
  addCustomRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  customInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 16, fontSize: 16 },
  addBtn: { backgroundColor: '#6366F1', width: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toggleText: { fontSize: 16, color: '#1E293B', fontWeight: '500' },
  
  chipScroll: { marginBottom: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, gap: 6 },
  chipText: { color: '#fff', fontWeight: '600' },
  
  contactsBox: { backgroundColor: '#fff', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, marginBottom: 10 },
  searchInput: { flex: 1, padding: 10, fontSize: 14 },
  
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarActive: { backgroundColor: '#6366F1' },
  avatarText: { fontWeight: '700', color: '#64748B' },
  contactName: { flex: 1, fontSize: 15, color: '#1E293B' },
  limitText: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginVertical: 10 },

  mainBtn: { backgroundColor: '#6366F1', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 40 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});