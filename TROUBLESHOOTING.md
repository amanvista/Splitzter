# Troubleshooting Database Issues

## Current Issues Observed:
- SQLite NullPointerException errors
- Database initialization failures
- Schema migration issues with `image_url` column

## Solutions Applied:

### 1. Fixed Redux Selector Memoization
- Added `useCallback` to expenses selector to prevent unnecessary re-renders
- This fixes the "Selector unknown returned a different result" warning

### 2. Database Schema Migration
- Added proper migration for `image_url` column
- Added fallback queries for backward compatibility
- Better error handling for schema changes

### 3. Backward Compatibility
- Journey creation/update now falls back to old schema if new schema fails
- Handles missing `image_url` column gracefully

## If Database Issues Persist:

### Option 1: Clear App Data (Recommended)
1. Close the app completely
2. Clear app data/cache from device settings
3. Restart the app - database will be recreated with correct schema

### Option 2: Database Reset (Development Only)
If you have access to the code, you can temporarily add this to reset the database:

```typescript
// In app/_layout.tsx, add this temporarily:
import { resetDatabase } from '@lib/database-native';

// In the initialize function, add:
// await resetDatabase(); // Uncomment this line to reset database
```

### Option 3: Uninstall/Reinstall App
1. Uninstall the app completely
2. Reinstall from development build
3. Database will be created fresh

## Prevention:
- Always use proper migrations when adding new columns
- Test schema changes on fresh installs
- Add fallback queries for backward compatibility

## Current Status:
✅ Redux selector memoization fixed
✅ Database migration added
✅ Backward compatibility added
✅ Better error handling added

The app should now handle database schema changes gracefully and prevent crashes.