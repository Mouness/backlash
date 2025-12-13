import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import type { Publication } from '../../types/models';
import { useTranslation } from 'react-i18next';
import PublicationForm from '../organisms/PublicationForm';

interface AdminPublicationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Publication, 'id'>) => Promise<void>;
  initialData?: Publication;
}

const AdminPublicationDialog: React.FC<AdminPublicationDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? t('admin.publication.title_edit') : t('admin.publication.title_new')}
      </DialogTitle>
      <PublicationForm
        initialData={initialData}
        onSave={async (data) => {
          await onSave(data);
          onClose(); // Close dialog after successful save (PublicationForm handles error alert)
        }}
        onCancel={onClose}
      />
    </Dialog>
  );
};

export default AdminPublicationDialog;
