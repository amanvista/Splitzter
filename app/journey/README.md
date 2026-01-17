# Journey Detail Components

This folder contains the refactored journey detail screen components for better maintainability and reusability.

## Component Structure

### `[id].tsx` (Main Screen)
The main journey detail screen that orchestrates all child components. Handles:
- Redux state management (journey, expenses, balance calculations)
- Data fetching via `loadExpensesForJourney` thunk
- Navigation and routing
- Share modal state
- Expense deletion logic

### `theme.ts`
Centralized theme constants used across all components:
- Color palette (primary, secondary, text colors, etc.)
- Consistent styling values

### `JourneyHeader.tsx`
Header component with image background displaying:
- Journey image with gradient overlay
- Navigation buttons (back, share)
- Journey name and total spent amount
- Statistics (expense count, member count)
- Props: `journey`, `imageUrl`, `totalExpenses`, `expenseCount`, `onBack`, `onShare`

### `ActionButtons.tsx`
Action buttons row component:
- "Add Expense" primary button
- "Import Expenses" secondary button
- Props: `onAddExpense`, `onImportExpenses`

### `SettlementsSection.tsx`
Settlement suggestions component:
- Shows who owes whom and how much
- Only renders if settlements exist
- Props: `settlements`, `getPersonName`

### `BalancesSection.tsx`
Group balances component:
- Shows each participant's balance status
- Color-coded amounts (green for owed, red for owes)
- Avatar with initials
- Props: `participants`, `balances`

### `ExpensesSection.tsx`
Expenses list component:
- Shows all expenses or empty state
- Handles delete confirmation dialog
- Maps expenses to ExpenseItem components
- Props: `expenses`, `getPersonName`, `onEditExpense`, `onDeleteExpense`

### `ExpenseItem.tsx`
Individual expense item component:
- Expense card with icon, title, amount, date
- Delete button
- Tap to edit functionality
- Props: `expense`, `getPersonName`, `onPress`, `onDelete`

## Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Testability**: Smaller components are easier to test individually
4. **Maintainability**: Changes to one component don't affect others
5. **Readability**: Main screen is now ~100 lines instead of ~300
6. **Theme Consistency**: Centralized theme ensures consistent styling
7. **Performance**: Smaller components can be optimized individually

## File Size Reduction
- Main file: ~300 lines → ~100 lines
- Logic distributed across 8 focused components
- Shared theme reduces style duplication