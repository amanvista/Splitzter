import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { Person, Settlement } from '../types';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ReminderModalProps {
  visible: boolean;
  settlement: Settlement | null;
  fromPerson: Person | null;
  toPerson: Person | null;
  journeyName: string;
  onClose: () => void;
  onSendReminder: () => void;
  onSendConfirmation: () => void;
}

export function ReminderModal({
  visible,
  settlement,
  fromPerson,
  toPerson,
  journeyName,
  onClose,
  onSendReminder,
  onSendConfirmation,
}: ReminderModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!settlement || !fromPerson || !toPerson) return null;

  const handleSendReminder = async () => {
    if (!fromPerson.phone) {
      Alert.alert(
        'No Phone Number',
        `${fromPerson.name} doesn't have a phone number saved. Please add their contact information first.`
      );
      return;
    }

    setIsLoading(true);
    try {
      await onSendReminder();
      Alert.alert('Reminder Sent!', `Payment reminder sent to ${fromPerson.name} via WhatsApp.`);
      onClose();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendConfirmation = async () => {
    if (!toPerson.phone) {
      Alert.alert(
        'No Phone Number',
        `${toPerson.name} doesn't have a phone number saved. Please add their contact information first.`
      );
      return;
    }

    setIsLoading(true);
    try {
      await onSendConfirmation();
      Alert.alert('Confirmation Sent!', `Settlement confirmation sent to ${toPerson.name} via WhatsApp.`);
      onClose();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Send Reminder</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.settlementInfo}>
            <View style={styles.settlementHeader}>
              <Ionicons name="arrow-forward" size={20} color="#6366F1" />
              <ThemedText style={styles.settlementText}>
                <ThemedText style={styles.bold}>{fromPerson.name}</ThemedText> pays{' '}
                <ThemedText style={styles.bold}>{toPerson.name}</ThemedText>
              </ThemedText>
            </View>
            <ThemedText style={styles.amount}>₹{settlement.amount.toLocaleString()}</ThemedText>
            <ThemedText style={styles.journeyName}>for "{journeyName}"</ThemedText>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, styles.reminderButton]}
              onPress={handleSendReminder}
              disabled={isLoading || !fromPerson.phone}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
              </View>
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>Send Payment Reminder</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Remind {fromPerson.name} about the pending payment
                </ThemedText>
                {!fromPerson.phone && (
                  <ThemedText style={styles.warningText}>
                    ⚠️ No phone number available
                  </ThemedText>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.confirmationButton]}
              onPress={handleSendConfirmation}
              disabled={isLoading || !toPerson.phone}
            >
              <View style={[styles.optionIcon, styles.confirmationIcon]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
              </View>
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>Mark as Settled</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Confirm payment received and notify {toPerson.name}
                </ThemedText>
                {!toPerson.phone && (
                  <ThemedText style={styles.warningText}>
                    ⚠️ No phone number available
                  </ThemedText>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
            <ThemedText style={styles.infoText}>
              Messages will be sent via WhatsApp. Make sure the contact has WhatsApp installed.
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settlementInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  settlementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settlementText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  bold: {
    fontWeight: '700',
  },
  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 4,
  },
  journeyName: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  reminderButton: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  confirmationButton: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  confirmationIcon: {
    backgroundColor: '#10B981',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  warningText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4338CA',
    marginLeft: 12,
    lineHeight: 20,
  },
});