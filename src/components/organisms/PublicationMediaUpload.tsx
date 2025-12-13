import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PublicationMediaUploadProps {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  docFile: File | null;
  currentDocUrl?: string;
}

const PublicationMediaUpload: React.FC<PublicationMediaUploadProps> = ({
  onImageChange,
  onDocChange,
  previewUrl,
  docFile,
  currentDocUrl,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 3, mb: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Button variant="contained" component="label" fullWidth>
          {t('admin.publication.upload_image', 'Upload Image')}
          <input type="file" hidden accept="image/*" onChange={onImageChange} />
        </Button>
        {previewUrl && (
          <Box sx={{ mt: 1, height: 100, borderRadius: 1, overflow: 'hidden' }}>
            <img src={previewUrl} alt="Preview" style={{ height: '100%', width: 'auto' }} />
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Button variant="outlined" component="label" fullWidth>
          {t('admin.publication.doc_upload')}
          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={onDocChange} />
        </Button>
        {(docFile || currentDocUrl) && (
          <Typography variant="caption" display="block" sx={{ mt: 1, px: 1 }}>
            {docFile ? docFile.name : t('admin.publication.current_doc')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PublicationMediaUpload;
