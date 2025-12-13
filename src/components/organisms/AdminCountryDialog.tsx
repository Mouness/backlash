import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Country } from '../../types/models';
import CountryForm from '../organisms/CountryForm';

interface AdminCountryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Country, 'id'>) => Promise<void>;
  initialData?: Country | null;
}

const AdminCountryDialog: React.FC<AdminCountryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? t('admin.country.title_edit') : t('admin.country.title_new')}
      </DialogTitle>
      <CountryForm
        initialData={initialData}
        onSubmit={async (data) => {
          await onSubmit(data);
          onClose();
        }}
        onCancel={onClose}
      />
    </Dialog>
  );
};

export default AdminCountryDialog;
