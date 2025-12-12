import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { countryService } from '../services/countryService';
import type { Country } from '../services/countryService';
import { MOCK_COUNTRIES } from '../data/mockCountries';

export const useCountryController = () => {
  const { t } = useTranslation();
  const { countries, loadingCountries: loading, refreshCountries } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const handleAddClick = () => {
    setEditingCountry(null);
    setDialogOpen(true);
  };

  const handleEditClick = (country: Country) => {
    setEditingCountry(country);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCountry(null);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      console.log('Deleting country:', id);
      await countryService.deleteCountry(id);
      await refreshCountries();
    } catch (error) {
      console.error('Failed to delete country', error);
      alert(t('countries.delete_error'));
    }
  };

  const handleSeed = async () => {
    if (!window.confirm(t('countries.seed_confirm'))) return;
    try {
      const currentDocs = await countryService.getCountries();
      const existingCodes = new Set(currentDocs.map((c) => c.code));

      let addedCount = 0;
      for (const mock of MOCK_COUNTRIES) {
        if (!existingCodes.has(mock.code)) {
          await countryService.addCountry(mock);
          addedCount++;
        }
      }

      await refreshCountries();
      if (addedCount > 0) {
        alert(t('countries.seed_success', { count: addedCount }));
      } else {
        alert(t('countries.seed_uptodate'));
      }
    } catch (error) {
      console.error('Error seeding countries:', error);
      alert(t('countries.seed_error', { error: String(error) }));
    }
  };

  const handleDialogSubmit = async (data: Omit<Country, 'id'>) => {
    try {
      if (editingCountry) {
        await countryService.updateCountry(editingCountry.id, data);
      } else {
        await countryService.addCountry(data);
      }
      refreshCountries();
    } catch (error) {
      console.error('Error saving country', error);
    }
  };

  return {
    countries,
    loading,
    dialogOpen,
    editingCountry,
    handleAddClick,
    handleEditClick,
    handleCloseDialog,
    handleDeleteClick,
    handleSeed,
    handleDialogSubmit,
  };
};
