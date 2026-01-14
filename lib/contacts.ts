import * as Contacts from 'expo-contacts';
import { Person } from '../types';

export const requestContactsPermission = async (): Promise<boolean> => {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted';
};

export const getContacts = async (): Promise<Person[]> => {
  const hasPermission = await requestContactsPermission();
  if (!hasPermission) {
    throw new Error('Contacts permission denied');
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
  });

  return data.map(contact => ({
    id: contact.id || `contact_${Date.now()}_${Math.random()}`,
    name: contact.name || 'Unknown',
    phone: contact.phoneNumbers?.[0]?.number,
    email: contact.emails?.[0]?.email,
    isFromContacts: true
  })).filter(contact => contact.name !== 'Unknown');
};