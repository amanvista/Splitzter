# Splitzter - Journey Expense Tracker

A React Native app built with Expo for tracking and splitting expenses during journeys with friends and family.

## Features

### Journey Management
- Create journeys with custom names and descriptions
- Add participants from contacts or manually
- Edit participant names as needed
- View journey summaries and statistics

### Expense Tracking
- Add expenses with titles, amounts, and categories
- Select who paid for each expense
- Choose which participants to split the expense between
- Support for partial splits (not everyone has to be included)
- Automatic calculation of individual shares

### Smart Balance Calculations
- Real-time balance tracking for each participant
- Shows who owes whom and how much
- Suggests optimal settlements to minimize transactions
- Individual expense summaries (total paid vs. total share)

### Contact Integration
- Import participants directly from device contacts
- Permission-based access to contacts
- Fallback to manual entry if contacts access is denied

### Statistics & Analytics
- Overall spending statistics across all journeys
- Per-journey breakdowns and averages
- Visual summaries of expenses and participants

## Tech Stack

- **Framework**: Expo (React Native)
- **Database**: SQLite (expo-sqlite)
- **Navigation**: Expo Router
- **Contacts**: expo-contacts
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use iOS Simulator / Android Emulator

## Usage

1. **Create a Journey**: Tap "New Journey" and add participants
2. **Add Expenses**: In a journey, tap "Add Expense" to record spending
3. **Track Balances**: View who owes what in the journey details
4. **Settle Up**: Use suggested settlements to balance accounts
5. **View Stats**: Check the Statistics tab for spending insights

## Database Schema

The app uses SQLite with the following main tables:
- `journeys` - Journey information
- `people` - Participant details
- `expenses` - Expense records
- `journey_participants` - Journey-participant relationships
- `expense_splits` - Expense split details

## Permissions

- **Contacts**: Optional, for importing participants from device contacts
- **Storage**: Required for SQLite database

## Development

The app follows a modular structure:
- `/types` - TypeScript type definitions
- `/lib` - Core business logic (database, calculations, contacts)
- `/app` - Screen components and navigation
- `/components` - Reusable UI components

## License

MIT License