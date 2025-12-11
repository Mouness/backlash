import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} {t('footer.rights')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
              {t('nav.contact')}
            </Link>
            <Link
              href="https://www.unine.ch"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              {t('footer.university')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
