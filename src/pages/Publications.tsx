import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { usePublicationController } from '../hooks/usePublicationController';
import AdminPublicationDialog from '../components/organisms/AdminPublicationDialog';

import { ENABLE_MOCKS } from '../config';

import { useNavigate } from 'react-router-dom';
import PublicationCard from '../components/molecules/PublicationCard';

const Publications: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Use Shared Data Context
  const {
    publications,
    loading,
    dialogOpen,
    editingPub,
    handleOpenDialog,
    handleCloseDialog,
    handleSave,
    handleDelete,
    handleSeed,
    loadMorePublications,
    hasMorePubs,
  } = usePublicationController();

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePubs && !loading) {
          loadMorePublications();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMorePubs, loading, loadMorePublications]);

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
          {ENABLE_MOCKS &&
            (publications.length === 0 ||
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

      {loading && publications.length === 0 ? (
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
              <Box key={pub.id} sx={{ mt: { md: index === 0 ? 0 : -4 } }}>
                <PublicationCard
                  publication={pub}
                  isLeft={isLeft}
                  currentUser={currentUser}
                  onEdit={(p) => handleOpenDialog(p)}
                  onDelete={handleDelete}
                  onClick={() => navigate(`/publications/${pub.id}`)}
                  month={month}
                  year={year}
                />
              </Box>
            );
          })}

          {/* Infinite Scroll Sentinel */}
          {hasMorePubs && (
            <Box
              ref={observerTarget}
              sx={{ display: 'flex', justifyContent: 'center', mt: 4, py: 2 }}
            >
              <CircularProgress size={28} />
            </Box>
          )}

          {!loading && publications.length === 0 && (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">{t('publications.no_data')}</Typography>
            </Box>
          )}
        </Box>
      )}

      <AdminPublicationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        initialData={editingPub}
      />
    </Container>
  );
};

export default Publications;
