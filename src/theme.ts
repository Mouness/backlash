import { createTheme, type ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Merriweather", "Times New Roman", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Merriweather", "Times New Roman", serif',
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Merriweather", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontFamily: '"Merriweather", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: '"Merriweather", "Times New Roman", serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Lato", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontSize: '1rem',
    },
    body1: {
      lineHeight: 1.6,
      fontSize: '1.05rem',
    },
    button: {
      fontFamily: '"Lato", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '8px 22px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp corners
          boxShadow: 'none',
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 0, // Enforce sharp corners everywhere
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: '1px solid #E0E0E0',
          boxShadow: '0px 10px 40px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
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
            // Light Mode (Journal Paper Style)
            primary: {
              main: '#1A237E', // Deep Navy
              light: '#534BAE',
              dark: '#000051',
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#880E4F', // Burgundy
              light: '#BC477B',
              dark: '#560027',
              contrastText: '#FFFFFF',
            },
            background: {
              default: '#FAFAFA', // Off-white/Cream
              paper: '#FFFFFF',
            },
            text: {
              primary: '#212121', // Soft black (Charcoal)
              secondary: '#616161', // Grey
            },
            divider: 'rgba(0, 0, 0, 0.08)',
          }
        : {
            // Dark Mode (Late Night Study Style)
            primary: {
              main: '#5C6BC0', // Softer Indigo
              light: '#8E99F3',
              dark: '#26418F',
              contrastText: '#FFFFFF',
            },
            secondary: {
              main: '#F48FB1', // Pink/Maroon accent for dark mode
              light: '#FFC1E3',
              dark: '#BF5F82',
              contrastText: '#000000',
            },
            background: {
              default: '#121212', // Material Dark
              paper: '#1E1E1E',
            },
            text: {
              primary: '#EEEEEE',
              secondary: '#BDBDBD',
            },
            divider: 'rgba(255, 255, 255, 0.08)',
          }),
    },
  });
};

export default getTheme('light');
