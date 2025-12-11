import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from 'react-i18next';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../services/publicationService';
import { MOCK_PUBLICATIONS } from '../data/mockPublications';

const PublicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  useEffect(() => {
    const fetchPublication = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try to find in Mocks first if it's a seed test
        // Actually, real app logic usually checks DB.
        // But since we use mocks heavily as fallback:
        let found: Publication | null = null;

        // Attempt DB fetch
        try {
          found = await publicationService.getPublication(id);
        } catch {
          console.warn('DB fetch failed, checking mocks');
        }

        if (!found) {
          // Check mocks
          found = MOCK_PUBLICATIONS.find((p) => p.id === id) || null;
        }
        setPublication(found);
      } catch (error) {
        console.error('Error fetching publication details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!publication) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">Publication not found.</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/publications')}
          sx={{ mt: 2 }}
        >
          Back to Publications
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/publications')}
        sx={{ mb: 4 }}
      >
        Back to Publications
      </Button>

      {publication.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 250, md: 500 },
            borderRadius: 4,
            backgroundImage: `url(${publication.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
            boxShadow: 3,
          }}
        />
      )}

      <Box sx={{ mb: 2 }}>
        <Chip label={publication.category.toUpperCase()} color="primary" sx={{ mr: 2 }} />
        <Typography variant="caption" color="text.secondary">
          {publication.date?.toDate().toLocaleDateString()}
        </Typography>
      </Box>

      <Typography variant="h3" fontWeight={700} gutterBottom>
        {publication.title[currentLang] || publication.title['en']}
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{ whiteSpace: 'pre-wrap', mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}
      >
        {publication.description[currentLang] || publication.description['en']}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {publication.documentUrl && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            href={publication.documentUrl}
            target="_blank"
          >
            Download Document
          </Button>
        )}

        {publication.link && (
          <Button
            variant="outlined"
            startIcon={<LaunchIcon />}
            href={publication.link}
            target="_blank"
          >
            Read More / External Link
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default PublicationDetails;
