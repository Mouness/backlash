import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../services/publicationService';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import AdminPublicationDialog from '../components/organisms/AdminPublicationDialog';
import ReactMarkdown from 'react-markdown';
import { getLocalizedContent } from '../utils/dataUtils';

const PublicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { publications, refreshPublications, loadingPublications } = useData();
  const { currentUser } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const publication = useMemo(() => {
    if (!id || publications.length === 0) return null;
    return publications.find((p) => p.id === id) || null;
  }, [id, publications]);

  const handleUpdate = async (data: Omit<Publication, 'id'>) => {
    if (!publication) return;
    try {
      if (publication.id) {
        await publicationService.updatePublication(publication.id, data);
        await refreshPublications();
        // UI will update automatically via useEffect on publications change
      }
    } catch (error) {
      console.error('Failed to update publication', error);
      alert('Failed to update publication');
    }
  };

  const handleDelete = async () => {
    if (!publication || !publication.id) return;
    if (!window.confirm(t('admin.common.confirm_delete'))) return;
    try {
      await publicationService.deletePublication(publication.id);
      await refreshPublications();
      navigate('/publications');
    } catch (error) {
      console.error('Failed to delete publication', error);
      alert('Failed to delete publication');
    }
  };

  if (loadingPublications && publications.length === 0) {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/publications')}>
          Back to Publications
        </Button>
        {currentUser && (
          <Box>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              {t('admin.common.edit')}
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              {t('admin.common.delete')}
            </Button>
          </Box>
        )}
      </Box>

      {publication.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 250, md: 500 },
            borderRadius: 0, // Sharp Academic Style
            backgroundImage: `url(${publication.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
            boxShadow: 'none',
            border: '1px solid #E0E0E0',
          }}
        />
      )}

      <Box sx={{ mb: 2 }}>
        <Chip
          label={publication.category.toUpperCase()}
          color="primary"
          sx={{
            mr: 2,
            borderRadius: 0,
            fontWeight: 'bold',
            letterSpacing: '0.05em'
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {publication.date?.toDate().toLocaleDateString()}
        </Typography>
      </Box>

      <Typography variant="h3" fontWeight={700} gutterBottom>
        {getLocalizedContent(publication.title, currentLang)}
      </Typography>

      <Box
        sx={{ mb: 4, typography: 'body1', '& p': { mb: 2 }, fontSize: '1.1rem', lineHeight: 1.8 }}
      >
        <ReactMarkdown>{getLocalizedContent(publication.description, currentLang)}</ReactMarkdown>
      </Box>

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

      <AdminPublicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleUpdate}
        initialData={publication}
      />
    </Container>
  );
};

export default PublicationDetails;
