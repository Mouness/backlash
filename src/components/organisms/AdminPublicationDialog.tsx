import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
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
// import Grid from '@mui/material/Grid';
import { useForm, Controller } from 'react-hook-form';
import { Timestamp } from 'firebase/firestore';
import type { Publication } from '../../services/publicationService';

interface AdminPublicationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Publication, 'id'>) => Promise<void>;
  initialData?: Publication;
}

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Event' },
  { value: 'article', label: 'Article' },
  { value: 'book', label: 'Book' },
];

const AdminPublicationDialog: React.FC<AdminPublicationDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
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
  }, [initialData, reset, open]);

  // Convert Firestore Timestamp to YYYY-MM-DD for input type="date"
  // and vice-versa
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
      onClose();
    } catch (error) {
      console.error('Failed to save publication', error);
      alert('Failed to save publication');
    } finally {
      setUploading(false);
    }
  };

  const currentLangCode = ['en', 'fr', 'de'][activeTab];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edit Publication' : 'Add Publication'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField select margin="dense" label="Category" fullWidth {...field}>
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
                    label="Date"
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

          {/* Title & Description for selected language */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name={`title.${currentLangCode}` as `title.${'en' | 'fr' | 'de'}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label={`Title (${currentLangCode.toUpperCase()})`}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
            <Controller
              name={`description.${currentLangCode}` as `description.${'en' | 'fr' | 'de'}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label={`Description (${currentLangCode.toUpperCase()})`}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              )}
            />
          </Box>

          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="External Link (Optional)"
                fullWidth
                variant="outlined"
                placeholder="https://..."
              />
            )}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {previewUrl && (
              <Box
                sx={{ mt: 2, maxWidth: 200, maxHeight: 200, overflow: 'hidden', borderRadius: 1 }}
              >
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: 'auto' }} />
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label">
              Upload Document (PDF/Word)
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleDocChange} />
            </Button>
            {(docFile || (initialData && initialData.documentUrl)) && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {docFile ? docFile.name : 'Current document attached'}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={uploading}>
            {uploading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminPublicationDialog;
