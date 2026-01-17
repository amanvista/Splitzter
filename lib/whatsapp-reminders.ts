import { Linking } from 'react-native';
import { Person, Settlement } from '../types';

export interface ReminderTemplate {
  type: 'payment' | 'settlement';
  message: string;
}

// Generate payment reminder message
export const generatePaymentReminder = (
  fromPerson: Person,
  toPerson: Person,
  amount: number,
  journeyName: string
): string => {
  return `Hi ${fromPerson.name}! 👋

Hope you're doing well! This is a friendly reminder about our recent trip "${journeyName}".

💰 Amount Due: ₹${amount.toLocaleString()}
👤 To: ${toPerson.name}

You can settle this amount at your convenience. Thanks for being awesome! 😊

- Sent via Splitzter 📱`;
};

// Generate settlement confirmation message
export const generateSettlementConfirmation = (
  fromPerson: Person,
  toPerson: Person,
  amount: number,
  journeyName: string
): string => {
  return `Hi ${toPerson.name}! 👋

Great news! ${fromPerson.name} has settled their payment for our trip "${journeyName}".

✅ Amount Received: ₹${amount.toLocaleString()}
👤 From: ${fromPerson.name}

Thanks for keeping track of our expenses! 🎉

- Sent via Splitzter 📱`;
};

// Send WhatsApp message
export const sendWhatsAppMessage = async (phoneNumber: string, message: string): Promise<void> => {
  try {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    // Check if WhatsApp is available
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      // Fallback to web WhatsApp
      const webWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      await Linking.openURL(webWhatsappUrl);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error('Failed to open WhatsApp. Please make sure WhatsApp is installed.');
  }
};

// Send payment reminder
export const sendPaymentReminder = async (
  settlement: Settlement,
  fromPerson: Person,
  toPerson: Person,
  journeyName: string
): Promise<void> => {
  if (!fromPerson.phone) {
    throw new Error(`${fromPerson.name} doesn't have a phone number saved.`);
  }
  
  const message = generatePaymentReminder(fromPerson, toPerson, settlement.amount, journeyName);
  await sendWhatsAppMessage(fromPerson.phone, message);
};

// Send settlement confirmation
export const sendSettlementConfirmation = async (
  settlement: Settlement,
  fromPerson: Person,
  toPerson: Person,
  journeyName: string
): Promise<void> => {
  if (!toPerson.phone) {
    throw new Error(`${toPerson.name} doesn't have a phone number saved.`);
  }
  
  const message = generateSettlementConfirmation(fromPerson, toPerson, settlement.amount, journeyName);
  await sendWhatsAppMessage(toPerson.phone, message);
};

// Get reminder options for a settlement
export const getReminderOptions = (
  settlement: Settlement,
  fromPerson: Person,
  toPerson: Person
): { canSendReminder: boolean; canSendConfirmation: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  let canSendReminder = true;
  let canSendConfirmation = true;
  
  if (!fromPerson.phone) {
    canSendReminder = false;
    reasons.push(`${fromPerson.name} doesn't have a phone number`);
  }
  
  if (!toPerson.phone) {
    canSendConfirmation = false;
    reasons.push(`${toPerson.name} doesn't have a phone number`);
  }
  
  return {
    canSendReminder,
    canSendConfirmation,
    reasons
  };
};