import { createTheme } from '@mui/material/styles';

// Institutional Pastel Blue Palette
// Primary: A soft, trustworthy blue
// Secondary: A complementary lighter blue or grey-blue
// Background: Clean white/off-white

const theme = createTheme({
  palette: {
    primary: {
      main: '#7DA5C2', // Slightly darker pastel blue (Medium between original and previous light)
      light: '#E0FBFC',
      dark: '#3D5A80',
      contrastText: '#2C3E50',
    },
    secondary: {
      main: '#E0FBFC', // Light Cyan/Blue
      light: '#FFFFFF',
      dark: '#98C1D9',
      contrastText: '#2C3E50',
    },
    background: {
      default: '#F0F4F8', // Even lighter grey/blue tint
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#2C3E50',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2C3E50',
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;
