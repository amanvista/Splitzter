import { Ionicons } from '@expo/vector-icons'; // Ensure you have icons installed
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/colors';
import {
  formatDetailedJourneyReport,
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
  const [selectedFormat, setSelectedFormat] = useState<'detailed' | 'full' | 'expenses' | 'settlements'>('detailed');

  const generateShareText = () => {
    switch (selectedFormat) {
      case 'detailed': return formatDetailedJourneyReport(journey, expenses);
      case 'expenses': return formatExpenseListForSharing(journey, expenses);
      case 'settlements': return formatSettlementsForSharing(journey, expenses);
      case 'full':
      default: return formatJourneyForSharing(journey, expenses, shareOptions);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = generateShareText();
      await Share.share({
        message: shareText,
        title: `${journey.name} Report`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const copyToClipboard = async () => {
    try {
      const shareText = generateShareText();
      // For cross-platform support, we use the Share API as primary or clipboard if available
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        Alert.alert('Success', 'Copied to clipboard');
      } else {
        await Share.share({ message: shareText });
      }
    } catch (e) {
      Alert.alert('Error', 'Clipboard not available');
    }
  };

  const formatOptions = [
    { key: 'detailed', label: 'Detailed Report', icon: 'document-text-outline' },
    { key: 'full', label: 'Complete Summary', icon: 'copy-outline' },
    { key: 'expenses', label: 'Expense List', icon: 'list-outline' },
    { key: 'settlements', label: 'Settlements', icon: 'people-outline' },
  ] as const;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        {/* Header Section */}
        <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-down" size={24} color={Colors.textInverse} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Share Report</ThemedText>
            <View style={{ width: 40 }} /> 
          </View>
          <ThemedText style={styles.headerDesc}>{journey.name}</ThemedText>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Format Selection - Horizontal or Grid for better UX */}
          <ThemedText style={styles.sectionLabel}>Report Format</ThemedText>
          <View style={styles.formatGrid}>
            {formatOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSelectedFormat(option.key)}
                style={[
                  styles.formatCard,
                  selectedFormat === option.key && styles.activeFormatCard
                ]}
              >
                <Ionicons 
                  name={option.icon} 
                  size={24} 
                  color={selectedFormat === option.key ? Colors.primary : Colors.textSecondary} 
                />
                <ThemedText style={[
                  styles.formatLabel,
                  selectedFormat === option.key && styles.activeFormatLabel
                ]}>
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Preview Section */}
          <ThemedText style={styles.sectionLabel}>Preview</ThemedText>
          <ThemedView style={styles.previewCard}>
            <ScrollView nestedScrollEnabled style={styles.previewInnerScroll}>
              <ThemedText style={styles.previewText}>{generateShareText()}</ThemedText>
            </ScrollView>
          </ThemedView>

          {/* Conditional Controls for 'Full' */}
          {selectedFormat === 'full' && (
            <ThemedView style={styles.configSection}>
              <ThemedText style={styles.sectionLabel}>Customize Content</ThemedText>
              {[
                { label: 'Summary', key: 'includeSummary' },
                { label: 'Expenses', key: 'includeExpenses' },
                { label: 'Balances', key: 'includeBalances' },
                { label: 'Settlements', key: 'includeSettlements' }
              ].map((opt) => (
                <View key={opt.key} style={styles.switchRow}>
                  <ThemedText style={styles.switchLabel}>{opt.label}</ThemedText>
                  <Switch
                    value={shareOptions[opt.key as keyof ShareOptions]}
                    onValueChange={(val) => setShareOptions(prev => ({ ...prev, [opt.key]: val }))}
                    trackColor={{ true: Colors.primaryLight }}
                    thumbColor={shareOptions[opt.key as keyof ShareOptions] ? Colors.primary : '#f4f3f4'}
                  />
                </View>
              ))}
            </ThemedView>
          )}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color={Colors.textInverse} style={{ marginRight: 8 }} />
              <ThemedText style={styles.primaryBtnText}>Share Report</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryBtn} onPress={copyToClipboard}>
              <Ionicons name="clipboard-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
              <ThemedText style={styles.secondaryBtnText}>Copy Text</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' 
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textInverse },
  headerDesc: { 
    fontSize: 14, color: Colors.textInverse, opacity: 0.8, 
    textAlign: 'center', marginTop: 10, fontWeight: '500' 
  },
  scrollContent: { padding: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  formatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  formatCard: {
    width: '48%', backgroundColor: Colors.surface, padding: 16, borderRadius: 16, 
    alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#eee',
    // Shadow
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2,
  },
  activeFormatCard: { borderColor: Colors.primary, backgroundColor: '#F0F7FF' },
  formatLabel: { marginTop: 8, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  activeFormatLabel: { color: Colors.primary },
  previewCard: {
    backgroundColor: '#1e1e1e', borderRadius: 16, height: 200, marginBottom: 25,
    padding: 2, overflow: 'hidden'
  },
  previewInnerScroll: { padding: 15 },
  previewText: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#00FF41', fontSize: 12 },
  configSection: { marginBottom: 25 },
  switchRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: Colors.surface, padding: 12, borderRadius: 12, marginBottom: 8 
  },
  switchLabel: { fontSize: 15, fontWeight: '500' },
  actionContainer: { marginTop: 10, marginBottom: 40 },
  primaryBtn: {
    backgroundColor: Colors.primary, flexDirection: 'row', padding: 18, 
    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12
  },
  primaryBtnText: { color: Colors.textInverse, fontSize: 18, fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 2, borderColor: Colors.primary, flexDirection: 'row', 
    padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center'
  },
  secondaryBtnText: { color: Colors.primary, fontSize: 16, fontWeight: '700' }
});