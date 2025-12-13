import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import {
  getLocalizedContent,
  getLocalizedText,
  extractTextFromTiptap,
} from '../../utils/dataUtils';
import type { Publication } from '../../types/models';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface LatestPublicationsProps {
  publications: Publication[];
}

const LatestPublications: React.FC<LatestPublicationsProps> = ({ publications }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'news':
        return 'primary';
      case 'event':
        return 'secondary';
      case 'article':
        return 'info';
      case 'book':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          {t('nav.publications')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('home.publications.subtitle') || 'Latest insights and updates'}
        </Typography>
      </Box>

      {publications.length > 0 ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: '50px' }}
        >
          {publications.slice(0, 5).map((pub) => (
            <SwiperSlide key={pub.id}>
              <Card
                sx={{
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'none',
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate(`/publications/${pub.id}`)}
              >
                {pub.imageUrl ? (
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${pub.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={pub.category.toUpperCase()}
                      size="small"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      color={getCategoryColor(pub.category) as any}
                      variant="outlined"
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    {getLocalizedText(pub.title, currentLang)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {extractTextFromTiptap(getLocalizedContent(pub.description, currentLang))}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">{t('home.publications.no_data')}</Typography>
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="outlined" size="large" component={RouterLink} to="/publications">
          {t('nav.publications')}
        </Button>
      </Box>
    </Container>
  );
};

export default LatestPublications;
