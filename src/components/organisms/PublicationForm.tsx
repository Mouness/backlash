import React, { useState } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  MenuItem,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import type { Publication } from '../../services/publicationService';

interface PublicationFormProps {
  initialData?: Publication;
  onSave: (data: Omit<Publication, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Event' },
  { value: 'article', label: 'Article' },
  { value: 'book', label: 'Book' },
];

const PublicationForm: React.FC<PublicationFormProps> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<Omit<Publication, 'id'>>({
    defaultValues: {
      title: { en: '', fr: '', de: '' },
      description: { en: '', fr: '', de: '' },
      category: 'news',
      link: '',
      date: Timestamp.now(),
    },
  });

  const [activeTab, setActiveTab] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        link: initialData.link || '',
        date: initialData.date,
      });
      if (initialData.imageUrl) {
        setPreviewUrl(initialData.imageUrl);
      }
    } else {
      reset({
        title: { en: '', fr: '', de: '' },
        description: { en: '', fr: '', de: '' },
        category: 'news',
        link: '',
        date: Timestamp.now(),
      });
      setPreviewUrl(null);
      setImageFile(null);
      setDocFile(null);
    }
  }, [initialData, reset]);

  const formatDateForInput = (ts: Timestamp) => {
    if (!ts) return '';
    try {
      return ts.toDate().toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    if (_e.target.files && _e.target.files[0]) {
      const file = _e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: Omit<Publication, 'id'>) => {
    setUploading(true);
    try {
      const finalData = { ...data };
      const { publicationService } = await import('../../services/publicationService');

      if (imageFile) {
        const url = await publicationService.uploadPublicationImage(imageFile);
        finalData.imageUrl = url;
      } else if (initialData?.imageUrl) {
        finalData.imageUrl = initialData.imageUrl;
      }

      if (docFile) {
        const docUrl = await publicationService.uploadPublicationDocument(docFile);
        finalData.documentUrl = docUrl;
      } else if (initialData?.documentUrl) {
        finalData.documentUrl = initialData.documentUrl;
      }

      await onSave(finalData);
    } catch (error) {
      console.error('Failed to save publication', error);
      alert(t('admin.publication.save_error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  select
                  margin="dense"
                  label={t('admin.publication.category')}
                  fullWidth
                  {...field}
                >
                  {CATEGORIES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  margin="dense"
                  label={t('admin.publication.date')}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formatDateForInput(field.value)}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    field.onChange(Timestamp.fromDate(date));
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 2 }}>
          <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
            <Tab label="English" />
            <Tab label="Français" />
            <Tab label="Deutsch" />
          </Tabs>
        </Box>

        {/* Title & Description for ALL languages (rendering all, hiding inactive) */}
        {['en', 'fr', 'de'].map((langCode, index) => (
          <Box key={langCode} sx={{ mb: 2, display: activeTab === index ? 'block' : 'none' }}>
            <Controller
              name={`title.${langCode}` as `title.${'en' | 'fr' | 'de'}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label={`${t('admin.common.title', 'Title')} (${langCode.toUpperCase()})`}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
            <Controller
              name={`description.${langCode}` as `description.${'en' | 'fr' | 'de'}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label={`${t('admin.common.description', 'Description')} (${langCode.toUpperCase()})`}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  helperText={t('admin.country.content_helper')}
                />
              )}
            />
          </Box>
        ))}

        <Controller
          name="link"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              label={t('admin.publication.link')}
              fullWidth
              variant="outlined"
              placeholder="https://..."
            />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 3, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Button variant="contained" component="label" fullWidth>
              {t('admin.publication.upload_image', 'Upload Image')}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
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
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleDocChange} />
            </Button>
            {(docFile || (initialData && initialData.documentUrl)) && (
              <Typography variant="caption" display="block" sx={{ mt: 1, px: 1 }}>
                {docFile ? docFile.name : t('admin.publication.current_doc')}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('admin.common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={uploading}>
          {uploading ? t('admin.common.saving') : t('admin.common.save')}
        </Button>
      </DialogActions>
    </form>
  );
};

export default PublicationForm;
