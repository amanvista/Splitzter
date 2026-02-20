# BlinkFeast CounterPro - Theme Guide

## Overview
This app uses a centralized theme system inspired by BlinkFeast's vibrant orange color palette. All theme configurations are managed through a single file for easy customization.

## Theme File Location
**`constants/theme.ts`** - This is the single source of truth for all theme-related configurations.

## How to Change the Theme

### 1. Update Colors
Edit `constants/theme.ts` and modify the `colors` object:

```typescript
colors: {
  primary: '#FF6B35',        // Main brand color
  primaryDark: '#E85A2A',    // Darker variant
  primaryLight: '#FF8C61',   // Lighter variant
  
  secondary: '#FFB627',      // Secondary color
  // ... more colors
}
```

### 2. Update Branding
Change app name, tagline, and logo:

```typescript
branding: {
  appName: 'BlinkFeast CounterPro',
  appNameShort: 'CounterPro',
  tagline: 'Split expenses in a blink',
  logo: '🍊',
}
```

### 3. Update Typography
Adjust font sizes and weights:

```typescript
typography: {
  fontSizes: {
    xs: 10,
    sm: 12,
    base: 14,
    // ... more sizes
  },
  fontWeights: {
    regular: '400',
    bold: '700',
    // ... more weights
  }
}
```

### 4. Update Spacing & Border Radius
Modify spacing and border radius values:

```typescript
spacing: {
  xs: 4,
  sm: 8,
  md: 12,
  // ... more spacing
}

borderRadius: {
  sm: 8,
  md: 12,
  lg: 16,
  // ... more radius
}
```

## Using the Theme in Components

### Import the Theme
```typescript
import { Theme } from '@/constants/theme';
// OR import specific parts
import { Colors, Typography, Spacing } from '@/constants/theme';
```

### Use in Styles
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  text: {
    color: Theme.colors.text,
    fontSize: Theme.typography.fontSizes.md,
    fontWeight: Theme.typography.fontWeights.bold,
  },
});
```

### Use in Gradients
```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { Theme, createGradient } from '@/constants/theme';

<LinearGradient
  colors={createGradient()}
  // OR
  colors={[Theme.colors.gradientStart, Theme.colors.gradientMid, Theme.colors.gradientEnd]}
>
  {/* content */}
</LinearGradient>
```

## Current Theme: BlinkFeast Orange

### Color Palette
- **Primary**: Vibrant Orange (#FF6B35)
- **Secondary**: Golden Yellow (#FFB627)
- **Accent**: Deep Orange-Red (#FF4500)
- **Background**: Warm Off-White (#FFF8F3)
- **Success**: Green (#4CAF50)
- **Warning**: Red (#F44336)

### Gradients
The app uses a three-color gradient:
1. Orange (#FF6B35)
2. Light Orange (#FF8C61)
3. Golden Yellow (#FFB627)

## Quick Theme Changes

### Change to Blue Theme
```typescript
colors: {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#64B5F6',
  secondary: '#03A9F4',
  gradientStart: '#2196F3',
  gradientMid: '#64B5F6',
  gradientEnd: '#03A9F4',
}
```

### Change to Green Theme
```typescript
colors: {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#81C784',
  secondary: '#8BC34A',
  gradientStart: '#4CAF50',
  gradientMid: '#66BB6A',
  gradientEnd: '#8BC34A',
}
```

### Change to Purple Theme (Original)
```typescript
colors: {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#8B5CF6',
  secondary: '#F59E0B',
  gradientStart: '#6366F1',
  gradientMid: '#8B5CF6',
  gradientEnd: '#A855F7',
}
```

## Helper Functions

### withOpacity
Add opacity to any color:
```typescript
import { withOpacity, Theme } from '@/constants/theme';

backgroundColor: withOpacity(Theme.colors.primary, 0.5) // 50% opacity
```

### createGradient
Create custom gradients:
```typescript
import { createGradient } from '@/constants/theme';

// Use default gradient
colors={createGradient()}

// Use custom colors
colors={createGradient(['#FF0000', '#00FF00', '#0000FF'])}
```

## Files Using Theme

### Core Files
- `constants/theme.ts` - Main theme configuration
- `constants/Colors.ts` - Re-exports colors for backward compatibility

### Updated Components
- `app/login/login.tsx` - Login screen
- `app/(tabs)/HomeHeader.tsx` - Home header
- All other components import from `constants/Colors.ts` which now uses the centralized theme

## Best Practices

1. **Always use Theme constants** instead of hardcoded colors
2. **Use semantic color names** (primary, secondary, success, warning)
3. **Test theme changes** on both light and dark modes
4. **Keep gradients consistent** across the app
5. **Update branding** in both Theme.ts and app.json

## App Configuration

Don't forget to update these files when changing branding:
- `app.json` - App name and slug
- `package.json` - Package name
- `constants/theme.ts` - Branding object

## Support

For questions or issues with theming, refer to this guide or check the theme.ts file for available options.
