import { createTheme, type ThemeOptions } from '@mui/material/styles';

// Institutional Pastel Blue Palette
// Primary: A soft, trustworthy blue
// Secondary: A complementary lighter blue or grey-blue
// Background: Clean white/off-white

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    ...baseTheme,
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Mode Palette
            primary: {
              main: '#7DA5C2',
              light: '#E0FBFC',
              dark: '#3D5A80',
              contrastText: '#2C3E50',
            },
            secondary: {
              main: '#E0FBFC',
              light: '#FFFFFF',
              dark: '#98C1D9',
              contrastText: '#2C3E50',
            },
            background: {
              default: '#F0F4F8',
              paper: '#FFFFFF',
            },
            text: {
              primary: '#2C3E50',
              secondary: '#546E7A',
            },
          }
        : {
            // Dark Mode Palette
            primary: {
              main: '#90CAF9', // Lighter blue for contrast on dark
              light: '#E3F2FD',
              dark: '#42A5F5',
              contrastText: '#000000',
            },
            secondary: {
              main: '#26A69A', // Teal accent
              light: '#4DB6AC',
              dark: '#00796B',
              contrastText: '#ffffff',
            },
            background: {
              default: '#0A1929', // Deep dark blue/grey
              paper: '#132F4C', // Slightly lighter for cards
            },
            text: {
              primary: '#E7EBF0', // Off-white
              secondary: '#B2BAC2', // Light grey
            },
          }),
    },
    components: {
      ...baseTheme.components,
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === 'light' ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.3)',
          },
        },
      },
    },
  });
};

export default getTheme('light'); // Default export for backwards compatibility if needed
