# Redux Toolkit Usage Guide

## ✅ Setup Complete!

Redux Toolkit has been integrated into your app with global state management for:
- **User** - Current logged-in user
- **Journeys** - All journeys and current journey
- **Expenses** - Expenses organized by journey

## Store Structure

```
src/store/
├── index.ts          # Store configuration & typed hooks
├── userSlice.ts      # User state management
├── journeySlice.ts   # Journey state management
├── expenseSlice.ts   # Expense state management
└── thunks.ts         # Async operations (DB calls)
```

## How to Use in Components

### 1. Import Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@store';
import { loadJourneys, createJourney } from '@store/thunks';
```

### 2. Access State

```typescript
function MyComponent() {
  // Get state from Redux
  const currentUser = useAppSelector(state => state.user.currentUser);
  const journeys = useAppSelector(state => state.journey.journeys);
  const expenses = useAppSelector(state => state.expense.expenses);
  const isLoading = useAppSelector(state => state.journey.isLoading);
  
  // ...
}
```

### 3. Dispatch Actions

```typescript
function MyComponent() {
  const dispatch = useAppDispatch();
  
  // Load data
  useEffect(() => {
    dispatch(loadJourneys());
  }, []);
  
  // Create new journey
  const handleCreate = async () => {
    const newJourney = { /* ... */ };
    await dispatch(createJourney(newJourney));
  };
}
```

## Available Thunks (Async Actions)

### User
- `loadCurrentUser()` - Load user from AsyncStorage
- `loginUser(user)` - Save and set current user

### Journey
- `loadJourneys()` - Load all journeys
- `loadJourneyById(id)` - Load specific journey
- `createJourney(journey)` - Create new journey
- `updateJourneyData(journey)` - Update journey
- `addParticipant({ journeyId, participant })` - Add member

### Expense
- `loadExpensesForJourney(journeyId)` - Load expenses for journey
- `createExpenseThunk(expense)` - Create new expense
- `updateExpenseThunk(expense)` - Update expense
- `deleteExpenseThunk({ journeyId, expenseId })` - Delete expense

## Example: Home Screen with Redux

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store';
import { loadJourneys } from '@store/thunks';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const journeys = useAppSelector(state => state.journey.journeys);
  const isLoading = useAppSelector(state => state.journey.isLoading);
  
  useEffect(() => {
    dispatch(loadJourneys());
  }, []);
  
  if (isLoading) return <LoadingView />;
  
  return (
    <FlatList
      data={journeys}
      renderItem={({ item }) => <JourneyCard journey={item} />}
    />
  );
}
```

## Example: Journey Detail with Redux

```typescript
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@store';
import { loadJourneyById, loadExpensesForJourney } from '@store/thunks';

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const journey = useAppSelector(state => state.journey.currentJourney);
  const expenses = useAppSelector(state => 
    id ? state.expense.expenses[id] || [] : []
  );
  
  useEffect(() => {
    if (id) {
      dispatch(loadJourneyById(id));
      dispatch(loadExpensesForJourney(id));
    }
  }, [id]);
  
  return (
    <View>
      <Text>{journey?.name}</Text>
      <FlatList data={expenses} /* ... */ />
    </View>
  );
}
```

## Example: Create Journey with Redux

```typescript
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@store';
import { createJourney } from '@store/thunks';

export default function CreateJourneyScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentUser = useAppSelector(state => state.user.currentUser);
  
  const handleCreate = async () => {
    const newJourney = {
      id: `j_${Date.now()}`,
      name: journeyName,
      participants: [currentUser!],
      createdAt: new Date().toISOString(),
    };
    
    await dispatch(createJourney(newJourney));
    router.back();
  };
  
  return (
    <View>
      {/* Form UI */}
      <Button onPress={handleCreate} title="Create" />
    </View>
  );
}
```

## Benefits

✅ **Single Source of Truth** - All state in one place
✅ **No Prop Drilling** - Access state from any component
✅ **Automatic Re-renders** - Components update when state changes
✅ **Type Safety** - Full TypeScript support
✅ **DevTools** - Redux DevTools for debugging
✅ **Optimized** - Only re-renders components that use changed state

## Migration Strategy

You can migrate screens gradually:

1. **Keep existing code working** - Database functions still work
2. **Add Redux to new features** - Use Redux for new screens
3. **Migrate one screen at a time** - Update existing screens gradually
4. **Test thoroughly** - Ensure data stays in sync

## Next Steps

1. Update screens to use Redux hooks instead of local state
2. Remove `useState` for journeys/expenses
3. Remove `useEffect` with database calls
4. Use `dispatch(thunk())` instead

The Redux store is now ready to use! Start by updating one screen at a time.
