import React from 'react';
import { Box, Container, Typography, useTheme, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';
import projectTeamImage from '../assets/images/project_team.png';

const Project: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" fontWeight={800} color="primary" gutterBottom>
            {t('project.title')}
          </Typography>
          <Box
            sx={{
              width: 100,
              height: 6,
              bgcolor: theme.palette.secondary.main,
              mx: 'auto',
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Content Section */}
        <Typography variant="h5" sx={{ mb: 6, lineHeight: 1.8, textAlign: 'justify' }}>
          {t('project.description')}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 8,
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: 'text.secondary',
            textAlign: 'justify',
          }}
        >
          {t('project.objectives')}
        </Typography>

        {/* Team Photo */}
        <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box
            component="img"
            src={projectTeamImage}
            alt={t('project.team_photo_alt')}
            sx={{
              width: '100%',
              height: { xs: 250, md: 500 },
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Card>
      </Container>
    </Box>
  );
};

export default Project;
