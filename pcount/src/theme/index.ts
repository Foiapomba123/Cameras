export interface Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    white: string;
    shadow: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSizes: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    xxlarge: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    white: '#FFFFFF',
    shadow: '#000000',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSizes: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 20,
    xxlarge: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    lg: '0px 4px 16px rgba(0, 0, 0, 0.15)',
  },
};