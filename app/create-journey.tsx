import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/colors';
import { getContacts } from '@/lib/contacts';
import { createJourney } from '@/lib/database';
import { Journey, Person } from '@/types';

export default function CreateJourneyScreen() {
  const [journeyName, setJourneyName] = useState('');
  const [journeyDescription, setJourneyDescription] = useState('');
  const [contacts, setContacts] = useState<Person[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Person[]>([]);
  const [customName, setCustomName] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contactList = await getContacts();
      setContacts(contactList);
    } catch (error) {
      console.log('Contacts permission denied or error:', error);
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

  const removeParticipant = (personId: string) => {
    setSelectedParticipants(selectedParticipants.filter(p => p.id !== personId));
  };

  const createNewJourney = async () => {
    if (!journeyName.trim()) {
      Alert.alert('Error', 'Please enter a journey name');
      return;
    }

    if (selectedParticipants.length === 0) {
      Alert.alert('Error', 'Please add at least one participant');
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

  const renderContact = ({ item }: { item: Person }) => {
    const isSelected = selectedParticipants.some(p => p.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => toggleParticipant(item)}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.contactInfo}>
          <ThemedView style={[styles.contactAvatar, isSelected && styles.selectedAvatar]}>
            <ThemedText style={[styles.contactInitial, isSelected && styles.selectedInitial]}>
              {item.name.charAt(0).toUpperCase()}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.contactDetails}>
            <ThemedText style={styles.contactName}>{item.name}</ThemedText>
            {item.phone && <ThemedText style={styles.contactPhone}>{item.phone}</ThemedText>}
          </ThemedView>
        </ThemedView>
        {isSelected && (
          <ThemedView style={styles.checkmark}>
            <ThemedText style={styles.checkmarkText}>✓</ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedParticipant = ({ item }: { item: Person }) => (
    <ThemedView style={styles.participantChip}>
      <ThemedText style={styles.participantName}>{item.name}</ThemedText>
      <TouchableOpacity onPress={() => removeParticipant(item.id)} style={styles.removeButton}>
        <ThemedText style={styles.removeButtonText}>×</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Create Journey</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Start tracking expenses with friends</ThemedText>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Journey Name *</ThemedText>
          <TextInput
            style={styles.input}
            value={journeyName}
            onChangeText={setJourneyName}
            placeholder="Enter journey name"
            placeholderTextColor={Colors.textLight}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={journeyDescription}
            onChangeText={setJourneyDescription}
            placeholder="Optional description"
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={3}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>Add Participants *</ThemedText>
          
          <ThemedView style={styles.addCustomSection}>
            <TextInput
              style={[styles.input, styles.customNameInput]}
              value={customName}
              onChangeText={setCustomName}
              placeholder="Enter name manually"
              placeholderTextColor={Colors.textLight}
            />
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={addCustomParticipant}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.contactsToggle}>
            <ThemedText style={styles.toggleLabel}>Load from contacts</ThemedText>
            <Switch 
              value={showContacts} 
              onValueChange={setShowContacts}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={showContacts ? Colors.primary : Colors.textLight}
            />
          </ThemedView>

          {selectedParticipants.length > 0 && (
            <ThemedView style={styles.selectedSection}>
              <ThemedText style={styles.selectedLabel}>Selected Participants:</ThemedText>
              <FlatList
                data={selectedParticipants}
                renderItem={renderSelectedParticipant}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.participantsList}
              />
            </ThemedView>
          )}

          {showContacts && (
            <ThemedView style={styles.contactsSection}>
              <ThemedText style={styles.contactsLabel}>Select from Contacts:</ThemedText>
              <FlatList
                data={contacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                style={[styles.contactsList, { maxHeight: 300 }]}
                showsVerticalScrollIndicator={false}
              />
            </ThemedView>
          )}
        </ThemedView>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.disabledButton]}
          onPress={createNewJourney}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={loading ? [Colors.textLight, Colors.textLight] : [Colors.primary, Colors.primaryLight]}
            style={styles.createButtonGradient}
          >
            <ThemedText style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Journey'}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textInverse,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addCustomSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  customNameInput: {
    flex: 1,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: Colors.textInverse,
    fontWeight: '600',
    fontSize: 16,
  },
  contactsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedSection: {
    marginBottom: 16,
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  participantsList: {
    maxHeight: 60,
  },
  participantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  participantName: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactsSection: {
    marginTop: 8,
  },
  contactsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  contactsList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  selectedContact: {
    backgroundColor: Colors.surfaceSecondary,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  selectedAvatar: {
    backgroundColor: Colors.primary,
  },
  contactInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  selectedInitial: {
    color: Colors.textInverse,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});