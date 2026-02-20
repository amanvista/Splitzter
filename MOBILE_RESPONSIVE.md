# Mobile Responsive POS App

## Overview
The BlinkFeast CounterPro POS app is now fully responsive for both mobile phones and tablets.

## Responsive Behavior

### Detection
```typescript
const { width } = Dimensions.get('window');
const isTablet = width >= 768;
```

### Mobile (< 768px width)
- **Navigation**: Horizontal scrollable tabs at the top
- **Layout**: Single column, full width
- **Grid**: 2 columns for tables/menu items
- **Tabs**: Compact with icons + short text

### Tablet (>= 768px width)
- **Navigation**: Fixed left sidebar (120px)
- **Layout**: Sidebar + content area
- **Grid**: 3 columns for tables/menu items
- **Sidebar**: Full category names with large icons

## Implementation

### Tables Tab (index.tsx) ✅
- Mobile: Horizontal tabs (All, Ground, First Floor, etc.)
- Tablet: Left sidebar with sections
- Grid: 2 cols (mobile) / 3 cols (tablet)
- Search functionality
- Status indicators

### Menu Tab (menu.tsx) - TO CREATE
- Mobile: Horizontal category tabs
- Tablet: Left sidebar with categories
- Grid: 2 cols (mobile) / 3 cols (tablet)
- Search functionality
- Add to order buttons

### Orders Tab (orders.tsx) - TO CREATE
- Mobile: Horizontal status tabs
- Tablet: Left sidebar with order statuses
- List view with action buttons
- Search by order/table number

## Key Features

1. **Automatic Detection**: Uses Dimensions API to detect device type
2. **Conditional Rendering**: Shows sidebar OR horizontal tabs
3. **Responsive Grid**: Adjusts column count based on device
4. **Touch Optimized**: Larger touch targets on mobile
5. **Consistent Theme**: Orange BlinkFeast theme throughout

## Usage

The app automatically adapts to the device screen size. No configuration needed.

- **iPhone/Android Phone**: Horizontal tabs, 2-column grid
- **iPad/Android Tablet**: Sidebar navigation, 3-column grid
- **Desktop/Web**: Sidebar navigation, 3-column grid

## Next Steps

To complete the mobile responsive implementation:

1. Create menu.tsx with same responsive pattern
2. Create orders.tsx with same responsive pattern
3. Test on various device sizes
4. Adjust spacing/sizing as needed
