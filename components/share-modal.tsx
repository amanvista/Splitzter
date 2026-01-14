import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    Switch,
    TouchableOpacity,
} from 'react-native';

import { Colors } from '@/constants/colors';
import {
    formatExpenseListForSharing,
    formatJourneyForSharing,
    formatSettlementsForSharing,
    ShareOptions
} from '@/lib/text-formatter';
import { Expense, Journey } from '@/types';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  journey: Journey;
  expenses: Expense[];
}

export function ShareModal({ visible, onClose, journey, expenses }: ShareModalProps) {
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    includeExpenses: true,
    includeBalances: true,
    includeSettlements: true,
    includeSummary: true,
  });
  const [selectedFormat, setSelectedFormat] = useState<'full' | 'expenses' | 'settlements'>('full');

  const generateShareText = () => {
    switch (selectedFormat) {
      case 'expenses':
        return formatExpenseListForSharing(journey, expenses);
      case 'settlements':
        return formatSettlementsForSharing(journey, expenses);
      case 'full':
      default:
        return formatJourneyForSharing(journey, expenses, shareOptions);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = generateShareText();
      
      const result = await Share.share({
        message: shareText,
        title: `${journey.name} - Expense Summary`,
      });

      if (result.action === Share.sharedAction) {
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share expense summary');
    }
  };

  const copyToClipboard = async () => {
    try {
      const shareText = generateShareText();
      // For web compatibility, we'll use the Share API or show an alert
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        Alert.alert('Copied!', 'Expense summary copied to clipboard');
      } else {
        // Fallback for mobile - use Share API
        await Share.share({ message: shareText });
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const formatOptions = [
    { key: 'full', label: 'Complete Summary', description: 'All details including expenses, balances, and settlements' },
    { key: 'expenses', label: 'Expense List Only', description: 'Just the list of expenses with amounts' },
    { key: 'settlements', label: 'Settlements Only', description: 'Who owes whom and how much' },
  ] as const;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <ThemedView style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Share Journey</ThemedText>
            <ThemedView style={styles.placeholder} />
          </ThemedView>
          <ThemedText style={styles.headerSubtitle}>Export and share expense details</ThemedText>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Format Options</ThemedText>
            {formatOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.formatOption,
                  selectedFormat === option.key && styles.selectedFormatOption
                ]}
                onPress={() => setSelectedFormat(option.key)}
                activeOpacity={0.7}
              >
                <ThemedView style={styles.formatOptionContent}>
                  <ThemedView style={[
                    styles.radioButton,
                    selectedFormat === option.key && styles.selectedRadioButton
                  ]}>
                    {selectedFormat === option.key && (
                      <ThemedView style={styles.radioButtonInner} />
                    )}
                  </ThemedView>
                  <ThemedView style={styles.formatOptionText}>
                    <ThemedText style={styles.formatOptionLabel}>{option.label}</ThemedText>
                    <ThemedText style={styles.formatOptionDescription}>{option.description}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {selectedFormat === 'full' && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Include Details</ThemedText>
              
              <ThemedView style={styles.optionRow}>
                <ThemedText style={styles.optionLabel}>Summary Statistics</ThemedText>
                <Switch
                  value={shareOptions.includeSummary}
                  onValueChange={(value) => setShareOptions(prev => ({ ...prev, includeSummary: value }))}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={shareOptions.includeSummary ? Colors.primary : Colors.textLight}
                />
              </ThemedView>

              <ThemedView style={styles.optionRow}>
                <ThemedText style={styles.optionLabel}>Expense List</ThemedText>
                <Switch
                  value={shareOptions.includeExpenses}
                  onValueChange={(value) => setShareOptions(prev => ({ ...prev, includeExpenses: value }))}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={shareOptions.includeExpenses ? Colors.primary : Colors.textLight}
                />
              </ThemedView>

              <ThemedView style={styles.optionRow}>
                <ThemedText style={styles.optionLabel}>Individual Balances</ThemedText>
                <Switch
                  value={shareOptions.includeBalances}
                  onValueChange={(value) => setShareOptions(prev => ({ ...prev, includeBalances: value }))}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={shareOptions.includeBalances ? Colors.primary : Colors.textLight}
                />
              </ThemedView>

              <ThemedView style={styles.optionRow}>
                <ThemedText style={styles.optionLabel}>Settlement Suggestions</ThemedText>
                <Switch
                  value={shareOptions.includeSettlements}
                  onValueChange={(value) => setShareOptions(prev => ({ ...prev, includeSettlements: value }))}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={shareOptions.includeSettlements ? Colors.primary : Colors.textLight}
                />
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preview</ThemedText>
            <ThemedView style={styles.previewContainer}>
              <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
                <ThemedText style={styles.previewText}>{generateShareText()}</ThemedText>
              </ScrollView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={styles.buttonGradient}
              >
                <ThemedText style={styles.buttonIcon}>📱</ThemedText>
                <ThemedText style={styles.buttonText}>Share via WhatsApp</ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.secondary, Colors.secondaryDark]}
                style={styles.buttonGradient}
              >
                <ThemedText style={styles.buttonIcon}>📋</ThemedText>
                <ThemedText style={styles.buttonText}>Copy to Clipboard</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </Modal>
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textInverse,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  formatOption: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedFormatOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceSecondary,
  },
  formatOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedRadioButton: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  formatOptionText: {
    flex: 1,
  },
  formatOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  formatOptionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  previewContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 200,
  },
  previewScroll: {
    padding: 16,
  },
  previewText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  shareButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  copyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textInverse,
  },
});