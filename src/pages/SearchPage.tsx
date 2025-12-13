import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Divider, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { getLocalizedContent, getLocalizedText, extractTextFromTiptap } from '../utils/dataUtils';
import Grid from '@mui/material/Grid';

const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { countries, publications, teamMembers } = useData();

  const query = new URLSearchParams(location.search).get('q') || '';
  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const results = useMemo(() => {
    if (!query) return { countries: [], publications: [], team: [] };

    const lowerQuery = query.toLowerCase();

    const filteredCountries = countries.filter(
      (c) =>
        (c.name[currentLang] || '').toLowerCase().includes(lowerQuery) ||
        (c.summary[currentLang] || '').toLowerCase().includes(lowerQuery),
    );

    const filteredPublications = publications.filter(
      (p) =>
        (getLocalizedText(p.title, currentLang) || '').toLowerCase().includes(lowerQuery) ||
        extractTextFromTiptap(getLocalizedContent(p.description, currentLang))
          .toLowerCase()
          .includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery),
    );

    const filteredTeam = teamMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        (m.role[currentLang] || '').toLowerCase().includes(lowerQuery),
    );

    return {
      countries: filteredCountries,
      publications: filteredPublications,
      team: filteredTeam,
    };
  }, [query, countries, publications, teamMembers, currentLang]);

  const hasResults =
    results.countries.length > 0 || results.publications.length > 0 || results.team.length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        {t('search.results_title', { query })}
      </Typography>

      {!query && <Typography color="text.secondary">{t('search.enter_query')}</Typography>}

      {query && !hasResults && (
        <Typography color="text.secondary">{t('search.no_results')}</Typography>
      )}

      {/* Countries Results */}
      {results.countries.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {t('nav.countries')}{' '}
            <Chip label={results.countries.length} size="small" color="primary" />
          </Typography>
          <Grid container spacing={2}>
            {results.countries.map((country) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={country.code}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                  onClick={() => navigate(`/countries/${country.code}`)}
                >
                  <CardContent>
                    <Typography variant="h6">{country.name[currentLang]}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {country.summary[currentLang]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Publications Results */}
      {results.publications.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {t('nav.publications')}{' '}
            <Chip label={results.publications.length} size="small" color="primary" />
          </Typography>
          <Grid container spacing={2}>
            {results.publications.map((pub) => (
              <Grid size={{ xs: 12, md: 6 }} key={pub.id}>
                <Card
                  sx={{ display: 'flex', cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                  onClick={() => navigate(`/publications/${pub.id}`)}
                >
                  {pub.imageUrl && (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        background: `url(${pub.imageUrl}) center/cover`,
                      }}
                    />
                  )}
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {getLocalizedText(pub.title, currentLang)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {/* Show only text preview for search results */}
                      {extractTextFromTiptap(
                        getLocalizedContent(pub.description, currentLang),
                      ).slice(0, 200)}
                      ...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Team Results */}
      {results.team.length > 0 && (
        <Box>
          <Divider sx={{ mb: 4 }} />
          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {t('nav.team')} <Chip label={results.team.length} size="small" color="primary" />
          </Typography>
          <Grid container spacing={2}>
            {results.team.map((member) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  {/* Placeholder avatar if no image */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'grey.200',
                      mx: 'auto',
                      mb: 1,
                      background: member.photoUrl
                        ? `url(${member.photoUrl}) center/cover`
                        : 'primary.light',
                      display: member.photoUrl ? 'block' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: member.photoUrl ? 'transparent' : 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {!member.photoUrl && member.name.charAt(0)}
                  </Box>
                  <Typography variant="subtitle1">{member.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.role[currentLang]}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;
