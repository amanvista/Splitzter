// BlinkFeast CounterPro - Centralized Theme Configuration
// Orange-themed design inspired by BlinkFeast

const lightColors = {
  // Primary orange palette
  primary: '#FF6B35', // Vibrant orange
  primaryDark: '#E85A2A', // Darker orange
  primaryLight: '#FF8C61', // Lighter orange
  
  // Secondary colors - Complementary warm tones
  secondary: '#FFB627', // Golden yellow
  secondaryDark: '#F5A623', // Darker yellow
  secondaryLight: '#FFC857', // Light yellow
  
  // Accent colors
  accent: '#FF4500', // Deep orange-red
  accentLight: '#FF7F50', // Coral
  
  // Success/positive
  success: '#4CAF50', // Green
  successLight: '#81C784',
  successDark: '#388E3C',
  
  // Warning/debt
  warning: '#F44336', // Red
  warningLight: '#EF5350',
  warningDark: '#D32F2F',
  
  // Neutral colors
  background: '#FFF8F3', // Warm off-white
  surface: '#FFFFFF',
  surfaceSecondary: '#FFF5ED', // Light orange tint
  
  // Text colors
  text: '#2C2C2C', // Dark gray
  textSecondary: '#666666', // Medium gray
  textLight: '#999999', // Light gray
  textInverse: '#FFFFFF',
  
  // Border and divider
  border: '#FFE4D6', // Light orange border
  borderLight: '#FFF0E6',
  
  // Gradient colors
  gradientStart: '#FF6B35', // Orange
  gradientMid: '#FF8C61', // Light orange
  gradientEnd: '#FFB627', // Golden yellow
  
  // Shadows and overlays
  shadow: 'rgba(255, 107, 53, 0.15)',
  overlay: 'rgba(44, 44, 44, 0.5)',
};

const darkColors = {
  // Primary orange palette (slightly adjusted for dark mode)
  primary: '#FF8C61', // Lighter orange for dark mode
  primaryDark: '#FF6B35', // Original orange
  primaryLight: '#FFB088', // Even lighter
  
  // Secondary colors
  secondary: '#FFC857', // Brighter yellow for dark mode
  secondaryDark: '#FFB627',
  secondaryLight: '#FFD580',
  
  // Accent colors
  accent: '#FF7F50', // Coral
  accentLight: '#FFA07A',
  
  // Success/positive
  success: '#66BB6A', // Lighter green
  successLight: '#81C784',
  successDark: '#4CAF50',
  
  // Warning/debt
  warning: '#EF5350', // Lighter red
  warningLight: '#E57373',
  warningDark: '#F44336',
  
  // Neutral colors (dark mode)
  background: '#1A1A1A', // Dark background
  surface: '#2C2C2C',
  surfaceSecondary: '#333333',
  
  // Text colors (inverted for dark mode)
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textLight: '#999999',
  textInverse: '#2C2C2C',
  
  // Border and divider
  border: '#444444',
  borderLight: '#333333',
  
  // Gradient colors
  gradientStart: '#FF8C61',
  gradientMid: '#FFB088',
  gradientEnd: '#FFC857',
  
  // Shadows and overlays
  shadow: 'rgba(255, 140, 97, 0.2)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const Theme = {
  // Primary Brand Colors - BlinkFeast Orange Theme
  colors: lightColors,
  
  // Typography
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      huge: 42,
      massive: 56,
    },
    fontWeights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
      black: '900' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 60,
  },
  
  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // App Branding
  branding: {
    appName: 'BlinkFeast CounterPro',
    appNameShort: 'CounterPro',
    tagline: 'Split expenses in a blink',
    logo: '🍊', // Orange emoji
  },
};

// Export individual parts for convenience
export const Colors = {
  light: lightColors,
  dark: darkColors,
};

export const Typography = Theme.typography;
export const Spacing = Theme.spacing;
export const BorderRadius = Theme.borderRadius;
export const Shadows = Theme.shadows;
export const Branding = Theme.branding;

// Helper function to create gradients
export const createGradient = (colors?: string[]) => {
  return colors || [Theme.colors.gradientStart, Theme.colors.gradientMid, Theme.colors.gradientEnd];
};

// Helper function for opacity
export const withOpacity = (color: string, opacity: number) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export default Theme;
