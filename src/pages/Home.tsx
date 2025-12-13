import React from 'react';
import { Box, Divider } from '@mui/material';
import { useData } from '../contexts/DataContext';
import HeroSection from '../components/organisms/HeroSection';
import HomeMapSection from '../components/organisms/HomeMapSection';
import LatestPublications from '../components/organisms/LatestPublications';
import TeamPreview from '../components/organisms/TeamPreview';

const CustomDivider = () => (
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
);

const Home: React.FC = () => {
  const { countries, teamMembers, publications } = useData();

  return (
    <Box sx={{ pb: 8 }}>
      <HeroSection />

      <HomeMapSection countries={countries} />

      <CustomDivider />

      <LatestPublications publications={publications} />

      <CustomDivider />

      <TeamPreview members={teamMembers} />
    </Box>
  );
};

export default Home;
