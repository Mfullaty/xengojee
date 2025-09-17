export const Colors = {
  // Primary brand colors
  primary: '#00D4FF',      // Bright cyan for primary actions
  primaryDark: '#00B8E6',  // Darker cyan for pressed states
  secondary: '#FF6B6B',    // Coral red for secondary actions
  accent: '#4ECDC4',       // Teal accent
  
  // Background colors
  background: '#0A0A0B',   // Deep black background
  surface: '#1A1A1D',     // Elevated surface color
  card: '#242428',        // Card background
  modal: '#2A2A2E',       // Modal/overlay background
  
  // Text colors
  text: '#FFFFFF',        // Primary text
  textSecondary: '#B0B0B0', // Secondary text
  textMuted: '#707070',   // Muted text
  textInverse: '#000000', // Text on light backgrounds
  
  // Status colors
  success: '#00E676',     // Success green
  warning: '#FFB74D',     // Warning orange
  error: '#FF5252',       // Error red
  info: '#42A5F5',        // Info blue
  
  // Border and divider colors
  border: '#333333',      // Default border
  divider: '#2A2A2A',     // Divider lines
  
  // Interactive states
  hover: '#333333',       // Hover state
  pressed: '#404040',     // Pressed state
  disabled: '#1A1A1A',    // Disabled background
  disabledText: '#555555', // Disabled text
  
  // Gradients
  gradientPrimary: ['#00D4FF', '#0099CC'] as const,
  gradientSecondary: ['#FF6B6B', '#FF5252'] as const,
  gradientDark: ['#1A1A1D', '#0A0A0B'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
};