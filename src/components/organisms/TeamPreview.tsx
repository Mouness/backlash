import React from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Face3Icon from '@mui/icons-material/Face3';
import Face6Icon from '@mui/icons-material/Face6';
import type { TeamMember } from '../../types/models';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TeamPreviewProps {
  members: TeamMember[];
}

const TeamPreview: React.FC<TeamPreviewProps> = ({ members }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  return (
    <Container maxWidth="xl" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          {t('home.team_preview.title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('home.team_preview.subtitle')}
        </Typography>
      </Box>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: '50px' }}
      >
        {members.map((member, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                p: 4,
                bgcolor: 'background.paper',
                boxShadow: 'none',
                textAlign: 'center',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                },
              }}
              onClick={() => navigate(`/team/${member.id}`)}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.light,
                  mb: 3,
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {member.photoUrl ? (
                  <Box
                    component="img"
                    src={member.photoUrl}
                    alt={member.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : member.gender === 'female' ? (
                  <Face3Icon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                ) : (
                  <Face6Icon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                )}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {member.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {member.role[currentLang] || member.role['en']}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="outlined" size="large" component={RouterLink} to="/team">
          {t('nav.team')}
        </Button>
      </Box>
    </Container>
  );
};

export default TeamPreview;
