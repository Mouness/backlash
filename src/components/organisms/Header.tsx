import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useScrollTrigger,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Logo from '../atoms/Logo';
import SearchBar from '../molecules/SearchBar';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import LoginModal from './LoginModal';

// Hide on scroll helper (optional, or just shrink)
interface Props {
  window?: () => Window;
  children?: React.ReactElement;
}

// Shrink header on scroll logic
function ElevationScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50, // Shrink after 50px
    target: window ? window() : undefined,
  });

  return React.cloneElement(
    children as React.ReactElement<{
      elevation?: number;
      style?: React.CSSProperties;
      color?: string;
    }>,
    {
      elevation: trigger ? 4 : 0,
      style: {
        paddingTop: trigger ? '0px' : '10px',
        paddingBottom: trigger ? '0px' : '10px',
        transition: 'all 0.3s ease',
      },
      color: trigger ? 'default' : 'transparent', // Change color on scroll?
    },
  );
}

const Header: React.FC = (props) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();

  // Mobile Menu State
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  // Language Menu State
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  // Mobile Search Toggle
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  // Login Modal State
  const [loginOpen, setLoginOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };
  const handleCloseLangMenu = (lang?: string) => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
    setAnchorElLang(null);
  };

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.project'), path: '/project' },
    { label: t('nav.countries'), path: '/countries' },
    { label: t('nav.publications'), path: '/publications' },
    { label: t('nav.team'), path: '/team' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <ElevationScroll {...props}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Logo />

            {/* Mobile Menu Icon */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {/* Mobile Search Icon */}
              <IconButton onClick={() => setShowMobileSearch(!showMobileSearch)} color="inherit">
                <SearchIcon />
              </IconButton>

              {/* Theme Toggle (Mobile) */}
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Mobile Language Switcher */}
              <IconButton onClick={handleOpenLangMenu} color="inherit">
                <LanguageIcon />
              </IconButton>

              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <MenuItem
                      key={item.path}
                      onClick={handleCloseNavMenu}
                      component={RouterLink}
                      to={item.path}
                      selected={active}
                      sx={{
                        fontWeight: active ? 'bold' : 'normal',
                        color: active ? theme.palette.primary.main : 'inherit',
                        bgcolor: active ? theme.palette.action.selected : 'transparent',
                      }}
                    >
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>

            {/* Desktop Menu */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 0, // Reduced gap as requested
              }}
            >
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      my: 2,
                      color: active ? theme.palette.primary.main : 'text.primary',
                      display: 'block',
                      fontWeight: active ? 700 : 400,
                      borderBottom: active
                        ? `2px solid ${theme.palette.primary.main}`
                        : '2px solid transparent',
                      borderRadius: 0,
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Desktop Search & Tools */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {/* Search Bar (Narrower) */}
              <Box sx={{ width: 220 }}>
                <SearchBar />
              </Box>

              {/* Theme Toggle (Desktop) */}
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {mode === 'dark' ? (
                  <LightModeIcon color="inherit" />
                ) : (
                  <DarkModeIcon color="inherit" />
                )}
              </IconButton>

              {/* Language Switcher */}
              <IconButton
                onClick={handleOpenLangMenu}
                color="primary"
                title={t('languages.change_language')}
              >
                <LanguageIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={() => handleCloseLangMenu()}
              >
                <MenuItem
                  onClick={() => handleCloseLangMenu('fr')}
                  selected={i18n.language === 'fr'}
                >
                  {t('languages.fr')}
                </MenuItem>
                <MenuItem
                  onClick={() => handleCloseLangMenu('en')}
                  selected={i18n.language === 'en'}
                >
                  {t('languages.en')}
                </MenuItem>
                <MenuItem
                  onClick={() => handleCloseLangMenu('de')}
                  selected={i18n.language === 'de'}
                >
                  {t('languages.de')}
                </MenuItem>
              </Menu>

              {currentUser ? (
                <>
                  <Box
                    sx={{
                      bgcolor: theme.palette.secondary.main, // Use Secondary for prestige
                      color: theme.palette.secondary.contrastText,
                      px: 2,
                      py: 0.5,
                      borderRadius: 0, // Sharp corners
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase', // Compliant with academic style
                      letterSpacing: '0.05em',
                    }}
                  >
                    ADMIN
                  </Box>
                  <Button variant="outlined" color="primary" size="small" onClick={logout}>
                    {t('nav.logout') || 'Logout'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setLoginOpen(true)}
                >
                  {t('nav.login')}
                </Button>
              )}
            </Box>
          </Toolbar>

          {/* Expandable Mobile Search */}
          {showMobileSearch && (
            <Box sx={{ pb: 2, display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
              <SearchBar />
            </Box>
          )}

          {/* Login Modal */}
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
