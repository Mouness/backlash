import { Box, Toolbar } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      {/* Toolbar spacer to prevent content from hiding behind fixed header */}
      <Toolbar sx={{ mb: 2 }} />

      <Box component="main" sx={{ flexGrow: 1 }} key={location.pathname} className="fade-in">
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;
