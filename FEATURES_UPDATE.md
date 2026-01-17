# New Features Added

## 1. Edit Journey Name & Description

### What's New:
- **Edit Button**: Added a pencil icon in the journey header next to the share button
- **Edit Modal**: Tap the edit button to open a modal where you can update:
  - Journey name
  - Journey description (optional)
- **Real-time Updates**: Changes are saved immediately and reflected across the app

### How to Use:
1. Open any journey detail page
2. Tap the pencil icon (✏️) in the top-right corner
3. Edit the journey name and/or description
4. Tap "Save" to confirm changes

## 2. WhatsApp Reminders & Settlement Notifications

### What's New:
- **Reminder Buttons**: Each settlement suggestion now has a chat bubble icon (💬)
- **Two Types of Messages**:
  - **Payment Reminder**: Send a friendly reminder to someone who owes money
  - **Settlement Confirmation**: Notify someone that payment has been received

### How to Use:
1. Go to any journey with pending settlements
2. Tap the chat bubble icon (💬) next to any settlement
3. Choose your action:
   - **Send Payment Reminder**: Reminds the person who owes money
   - **Mark as Settled**: Confirms payment received and notifies the recipient

### Message Templates:

#### Payment Reminder:
```
Hi [Name]! 👋

Hope you're doing well! This is a friendly reminder about our recent trip "[Journey Name]".

💰 Amount Due: ₹[Amount]
👤 To: [Recipient Name]

You can settle this amount at your convenience. Thanks for being awesome! 😊

- Sent via Splitzter 📱
```

#### Settlement Confirmation:
```
Hi [Name]! 👋

Great news! [Payer Name] has settled their payment for our trip "[Journey Name]".

✅ Amount Received: ₹[Amount]
👤 From: [Payer Name]

Thanks for keeping track of our expenses! 🎉

- Sent via Splitzter 📱
```

### Requirements:
- **Phone Numbers**: Participants must have phone numbers saved in their contact info
- **WhatsApp**: Recipients must have WhatsApp installed
- **Permissions**: The app will request permission to open WhatsApp

### Error Handling:
- If a participant doesn't have a phone number, you'll see a warning message
- If WhatsApp isn't installed, the app will try to open WhatsApp Web
- Clear error messages guide you through any issues

## Technical Implementation

### Database Updates:
- Added `updateJourney` function to both native SQLite and web storage
- Added `imageUrl` field to journey database schema
- Updated Redux store with `updateJourneyThunk`

### New Components:
- `EditJourneyModal`: Modal for editing journey details
- `ReminderModal`: Modal for sending WhatsApp reminders
- `whatsapp-reminders.ts`: Utility functions for WhatsApp integration

### Updated Components:
- `JourneyHeader`: Added edit button
- `SettlementsSection`: Added reminder buttons for each settlement
- Journey detail page: Integrated all new functionality

## Usage Tips

1. **Keep Contact Info Updated**: Make sure participants have phone numbers saved for WhatsApp reminders to work
2. **Friendly Reminders**: Use payment reminders sparingly to maintain good relationships
3. **Quick Settlements**: Use settlement confirmations to quickly notify when payments are received
4. **Edit Journey Names**: Keep journey names descriptive and up-to-date for better organization

## Future Enhancements

Potential future features could include:
- Custom message templates
- Reminder scheduling
- Payment tracking integration
- Group WhatsApp messages
- SMS fallback for non-WhatsApp users