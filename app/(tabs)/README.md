# Home Screen Components

This folder contains the refactored home screen components for better maintainability and reusability.

## Component Structure

### `index.tsx` (Main Screen)
The main home screen component that orchestrates all child components. Handles:
- Redux state management (journeys, loading state)
- Data fetching via `loadJourneys` thunk
- Navigation to create journey screen
- Conditional rendering based on data state

### `HomeHeader.tsx`
Gradient header component displaying:
- App title "Splitzter"
- Subtitle with loading state
- "New Journey" button
- Props: `onAddJourney`, `isLoading`

### `JourneyGrid.tsx`
Grid layout component for displaying journeys:
- 2-column FlatList
- Manages sample images rotation
- Handles navigation to journey detail
- Props: `journeys`

### `JourneyCard.tsx`
Individual journey card component:
- Image with gradient overlay
- Journey name
- Participant count
- Creation date
- Props: `journey`, `imageUrl`, `onPress`

### `EmptyJourneysState.tsx`
Empty state component shown when no journeys exist:
- Backpack emoji icon
- "No journeys yet" message
- Helpful subtext

## Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Testability**: Smaller components are easier to test
4. **Maintainability**: Changes to one component don't affect others
5. **Readability**: Main screen is now ~50 lines instead of ~300
