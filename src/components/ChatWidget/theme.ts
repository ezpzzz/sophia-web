// Base color palette
const colors = {
  primary: '#5423E7',
  secondary: '#1E1B3C',
  background: '#F8F9FE',
  white: '#FFFFFF',
  gray: {
    100: '#F8F9FE',
    200: '#EEF0F6',
    300: '#E2E4ED',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1E1B3C',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
  }
}

// Theme configuration
export const defaultTheme = {
  header: {
    background: colors.secondary,
    text: colors.white,
    icons: colors.white,
    buttons: {
      background: 'rgba(255, 255, 255, 0.1)',
      hover: 'rgba(255, 255, 255, 0.2)',
    }
  },
  launcher: {
    background: colors.primary,
    shadow: 'rgba(84, 35, 231, 0.1)',
  },
  messages: {
    background: colors.background,
    user: {
      background: colors.primary,
      text: colors.white,
    },
    bot: {
      background: colors.white,
      text: colors.secondary,
    },
    timestamp: colors.gray[500],
  },
  input: {
    background: colors.background,
    text: colors.secondary,
    placeholder: colors.gray[500],
    border: colors.gray[300],
    button: {
      default: colors.gray[400],
      active: colors.primary,
    }
  },
  preview: {
    background: colors.white,
    text: colors.secondary,
    timestamp: colors.gray[500],
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  status: {
    ok: colors.status.success,
    warn: colors.status.warning,
    crit: colors.status.error,
  }
}

export type Theme = typeof defaultTheme

// Helper to merge custom theme with default theme
export function createTheme(customTheme: Partial<Theme>): Theme {
  return {
    ...defaultTheme,
    ...customTheme,
  }
} 