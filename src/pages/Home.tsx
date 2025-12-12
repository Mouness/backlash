import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Face3Icon from '@mui/icons-material/Face3';
import Face6Icon from '@mui/icons-material/Face6';
import ArticleIcon from '@mui/icons-material/Article';
import InteractiveMap from '../components/organisms/InteractiveMap';
import { useData } from '../contexts/DataContext';
// Local Images
import slide1Image from '../assets/images/slide1-structure.jpg';
import slide2Image from '../assets/images/slide2-law.jpg';
import slide3Image from '../assets/images/slide3-global.jpg';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { countries, teamMembers, publications } = useData();

  // Derived state for map
  // Derived state for map
  const highlightedCodes = countries.map((c) => c.code);
  const countryScores = countries.reduce((acc, c) => {
    if (c.score !== undefined) acc[c.code] = c.score;
    return acc;
  }, {} as { [code: string]: number });

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

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const heroSlides = [
    {
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      image: slide1Image,
    },
    {
      title: t('home.hero.slide2.title'),
      subtitle: t('home.hero.slide2.subtitle'),
      image: slide2Image,
    },
    {
      title: t('home.hero.slide3.title'),
      subtitle: t('home.hero.slide3.subtitle'),
      image: slide3Image,
    },
  ];

  return (
    <Box sx={{ pb: 8 }}>
      {/* HERO SLIDER */}
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
                  <Typography
                    variant="h5"
                    sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/project"
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.getContrastText(theme.palette.secondary.main),
                      '&:hover': {
                        bgcolor: theme.palette.secondary.dark,
                      },
                    }}
                  >
                    {t('nav.project')}
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* INTERACTIVE MAP SECTION */}
      <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
            {t('map.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('map.description')}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <InteractiveMap
            highlightedCodes={highlightedCodes}
            countryScores={countryScores}
            minHeight="auto"
            height={400}
            center={[0, 0]}
          />
        </Box>
      </Container>

      <Divider
        sx={{
          my: 10,
          mx: 'auto',
          width: '15%',
          borderBottomWidth: 3,
          borderColor: 'primary.main',
          opacity: 0.25,
          borderRadius: 1,
        }}
      />

      {/* LATEST PUBLICATIONS SECTION */}
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
                    borderRadius: 4,
                    boxShadow: theme.shadows[3],
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
                      {pub.title[currentLang] || pub.title['en']}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {pub.description[currentLang] || pub.description['en']}
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

      <Divider
        sx={{
          my: 10,
          mx: 'auto',
          width: '15%',
          borderBottomWidth: 3,
          borderColor: 'primary.main',
          opacity: 0.25,
          borderRadius: 1,
        }}
      />

      {/* TEAM PREVIEW SECTION */}
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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {teamMembers.map((member: any, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[3],
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
    </Box>
  );
};

export default Home;
