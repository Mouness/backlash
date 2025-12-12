import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  Button,
  Chip,
  Link,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../services/publicationService';
import { MOCK_PUBLICATIONS } from '../data/mockPublications';
import AdminPublicationDialog from '../components/organisms/AdminPublicationDialog';
import { useTheme } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';

const Publications: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Use Shared Data Context
  const { publications, loadingPublications: loading, refreshPublications } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | undefined>(undefined);

  const handleOpenDialog = (pub?: Publication) => {
    setEditingPub(pub);
    setDialogOpen(true);
  };

  const handleSave = async (data: Omit<Publication, 'id'>) => {
    try {
      if (editingPub && editingPub.id) {
        await publicationService.updatePublication(editingPub.id, data);
      } else {
        await publicationService.addPublication(data);
      }
      refreshPublications();
    } catch (error) {
      console.error('Error saving publication:', error);
    }
  };

  const handleDelete = async (id: string) => {
    // Direct execution without confirm
    try {
      await publicationService.deletePublication(id);
      refreshPublications();
    } catch (error) {
      console.error('Error deleting pub:', error);
      alert(t('publications.delete_error'));
    }
  };

  const handleSeed = async () => {
    // Direct execution without confirm to avoid blocking
    alert(t('publications.seed_start'));

    try {
      const currentDocs = await publicationService.getPublications();
      const existingTitles = new Set(currentDocs.map((p) => p.title['en']));

      let addedCount = 0;
      for (const p of MOCK_PUBLICATIONS) {
        if (!existingTitles.has(p.title['en'])) {
          await publicationService.addPublication(p);
          addedCount++;
        }
      }
      await refreshPublications();

      if (addedCount > 0) {
        alert(t('publications.seed_success', { count: addedCount }));
      } else {
        alert(t('publications.seed_uptodate'));
      }
    } catch (error) {
      console.error('Error seeding publications:', error);
      alert(t('publications.seed_error', { error: String(error) }));
    }
  };

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
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
            {t('nav.publications')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('publications.subtitle')}
          </Typography>
        </Box>

        <Box>
          {(publications.length === 0 ||
            publications.some((p) => p.id && p.id.startsWith('mock-'))) && (
              <Button variant="outlined" color="warning" onClick={handleSeed} sx={{ mr: 2 }}>
                {t('publications.initialize_db')}
              </Button>
            )}

          {currentUser && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              {t('publications.add_post')}
            </Button>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ position: 'relative', my: 8 }}>
          {/* Central Vertical Line (Desktop only) */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: 0,
              bottom: 0,
              width: '4px',
              bgcolor: 'primary.main', // Stronger color
              opacity: 0.2,
              borderRadius: 1,
              display: { xs: 'none', md: 'block' },
            }}
          />

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {publications.map((pub: any, index) => {
            const isLeft = index % 2 === 0;
            const dateObj = pub.date?.toDate();
            const year = dateObj?.getFullYear();
            const month = dateObj?.toLocaleString(i18n.language, { month: 'short' });

            return (
              <Box
                key={pub.id}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: isLeft ? 'flex-end' : 'flex-start' },
                  mb: { xs: 8, md: 0 },
                  position: 'relative',
                  width: '100%',
                  // Reduced negative margin for more spacing
                  mt: { md: index === 0 ? 0 : -4 },
                }}
              >
                {/* Center Date (Desktop only) */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '15%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Chip
                    label={`${month} ${year}`}
                    color="primary"
                    size="small"
                    variant="filled"
                    sx={{
                      fontWeight: 'bold',
                      boxShadow: 3,
                      border: `4px solid ${theme.palette.background.default}`,
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>

                {/* Card Container */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '35%' }, // Reduced to 35%
                    position: 'relative',
                    mr: { md: isLeft ? '9%' : 0 }, // Percentage margin for responsive spacing
                    ml: { md: isLeft ? 0 : '9%' },
                  }}
                >
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      borderRadius: 4,
                      boxShadow: theme.shadows[3],
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        zIndex: 10, // Bring to front on hover
                      },
                    }}
                    onClick={() => navigate(`/publications/${pub.id}`)}
                  >
                    {/* Existing Card Content */}
                    {pub.imageUrl && (
                      <Box
                        sx={{
                          height: 250,
                          width: '100%',
                          backgroundImage: `url(${pub.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )}

                    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={pub.category.toUpperCase()}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          color={getCategoryColor(pub.category) as any}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>

                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {pub.title[currentLang] || pub.title['en']}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {pub.description[currentLang] || pub.description['en']}
                      </Typography>

                      {pub.link && (
                        <Button
                          endIcon={<LaunchIcon />}
                          component={Link}
                          href={pub.link}
                          target="_blank"
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          {t('publications.read_more')}
                        </Button>
                      )}
                    </Box>

                    {currentUser && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          boxShadow: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(pub);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(pub.id!);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Card>

                  {/* Arrow connection */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      transform: 'translateY(-50%)',
                      [isLeft ? 'right' : 'left']: -16,
                      width: 0,
                      height: 0,
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      [isLeft ? 'borderLeft' : 'borderRight']:
                        `10px solid ${theme.palette.background.paper}`,
                      filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))',
                      display: { xs: 'none', md: 'block' },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
          {!loading && publications.length === 0 && (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">{t('publications.no_data')}</Typography>
            </Box>
          )}
        </Box>
      )}

      <AdminPublicationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingPub}
      />
    </Container>
  );
};

export default Publications;
