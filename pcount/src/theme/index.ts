export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    accentLight: string;
    secondary: string;
    background: string;
    backgroundGradient: string;
    surface: string;
    surfaceSecondary: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textInverse: string;
    border: string;
    borderLight: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
    infoLight: string;
    white: string;
    black: string;
    shadow: string;
    overlay: string;
  };
  gradients: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
  };
  fonts: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
    black: string;
  };
  fontSizes: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    full: number;
  };
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#6366f1',
    primaryLight: '#a5b4fc',
    primaryDark: '#4338ca',
    accent: '#06b6d4',
    accentLight: '#67e8f9',
    secondary: '#8b5cf6',
    background: '#fefefe',
    backgroundGradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    surface: '#ffffff',
    surfaceSecondary: '#f8fafc',
    surfaceElevated: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    textInverse: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fecaca',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    white: '#ffffff',
    black: '#000000',
    shadow: '#1e293b',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    accent: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  fonts: {
    regular: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    medium: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    semiBold: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    bold: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    black: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
};