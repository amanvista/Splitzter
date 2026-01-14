import { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { Person } from '@/types';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ParticipantEditorProps {
  participant: Person;
  visible: boolean;
  onSave: (updatedParticipant: Person) => void;
  onCancel: () => void;
}

export function ParticipantEditor({ participant, visible, onSave, onCancel }: ParticipantEditorProps) {
  const [name, setName] = useState(participant.name);
  const [phone, setPhone] = useState(participant.phone || '');
  const [email, setEmail] = useState(participant.email || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    const updatedParticipant: Person = {
      ...participant,
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    };

    onSave(updatedParticipant);
  };

  const handleCancel = () => {
    // Reset to original values
    setName(participant.name);
    setPhone(participant.phone || '');
    setEmail(participant.email || '');
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Edit Participant</ThemedText>
          <TouchableOpacity onPress={handleSave}>
            <ThemedText style={styles.saveButton}>Save</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor="#999"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>Phone</ThemedText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});