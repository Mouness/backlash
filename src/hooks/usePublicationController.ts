import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { publicationService } from '../services/publicationService';
import type { Publication } from '../services/publicationService';
import { MOCK_PUBLICATIONS } from '../data/mockPublications';

export const usePublicationController = () => {
  const { t } = useTranslation();
  const { publications, loadingPublications: loading, refreshPublications } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | undefined>(undefined);

  const handleOpenDialog = (pub?: Publication) => {
    setEditingPub(pub);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPub(undefined);
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
    try {
      await publicationService.deletePublication(id);
      refreshPublications();
    } catch (error) {
      console.error('Error deleting pub:', error);
      alert(t('publications.delete_error'));
    }
  };

  const handleSeed = async () => {
    alert(t('publications.seed_start'));

    try {
      const currentDocs = await publicationService.getPublications();
      const existingTitles = new Set(
        currentDocs.map((p) => {
          const title = p.title;
          if (typeof title === 'string') return title;
          const localizedTitle = title as { [key: string]: string };
          return localizedTitle['en'] || '';
        }),
      );

      let addedCount = 0;
      for (const p of MOCK_PUBLICATIONS) {
        const title = p.title;
        const enTitle =
          typeof title === 'string' ? title : (title as { [key: string]: string })['en'];
        if (!existingTitles.has(enTitle)) {
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

  return {
    publications,
    loading,
    dialogOpen,
    editingPub,
    handleOpenDialog,
    handleCloseDialog,
    handleSave,
    handleDelete,
    handleSeed,
  };
};
