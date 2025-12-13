import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Local Images
import slide1Image from '../../assets/images/slide1-structure.jpg';
import slide2Image from '../../assets/images/slide2-law.jpg';
import slide3Image from '../../assets/images/slide3-global.jpg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const heroSlides = [
    {
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      image: slide1Image,
      buttonLabel: t('home.hero.slide1.button'),
      buttonLink: '/project',
    },
    {
      title: t('home.hero.slide2.title'),
      subtitle: t('home.hero.slide2.subtitle'),
      image: slide2Image,
      buttonLabel: t('home.hero.slide2.button'),
      buttonLink: '/publications',
    },
    {
      title: t('home.hero.slide3.title'),
      subtitle: t('home.hero.slide3.subtitle'),
      image: slide3Image,
      buttonLabel: t('home.hero.slide3.button'),
      buttonLink: '/countries',
    },
  ];

  return (
    <Box sx={{ height: '70vh', width: '100%', position: 'relative' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        style={{ width: '100%', height: '100%' }}
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                px: 2,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  maxWidth: '800px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {slide.title}
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={slide.buttonLink}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.getContrastText(theme.palette.secondary.main),
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  {slide.buttonLabel}
                </Button>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroSection;
