import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TeamMember } from '../../services/teamService';
import { useTranslation } from 'react-i18next';

interface AdminTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  initialData?: TeamMember;
}

const AdminTeamDialog: React.FC<AdminTeamDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0=en, 1=fr, 2=de

  const { register, handleSubmit, reset, setValue } = useForm<Omit<TeamMember, 'id'>>({
    defaultValues: {
      name: '',
      gender: 'female',
      order: 10,
      role: { en: '', fr: '', de: '' },
      bio: { en: '', fr: '', de: '' },
      email: '',
      photoUrl: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('gender', initialData.gender);
      setValue('order', initialData.order);
      setValue('role', initialData.role);
      setValue('bio', initialData.bio || { en: '', fr: '', de: '' });
      setValue('email', initialData.email || '');
      setValue('photoUrl', initialData.photoUrl || '');
      setPreviewUrl(initialData.photoUrl || null);
    } else {
      reset({
        name: '',
        gender: 'female',
        order: 10,
        role: { en: '', fr: '', de: '' },
        bio: { en: '', fr: '', de: '' },
        email: '',
        photoUrl: '',
      });
      setPreviewUrl(null);
    }
    setPhotoFile(null);
  }, [initialData, setValue, reset, open]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: Omit<TeamMember, 'id'>) => {
    if (photoFile) {
      // Upload logic handled by parent via onSave, or we handle it here?
      // The prop onSave expects Omit<TeamMember, 'id'>.
      // We should ideally modify onSave to handle the file, OR we upload here and pass the URL.
      // Let's upload here to keep onSave simple or delegate.
      // Actually, best practice: Service handles it. But we defined uploadTeamMemberPhoto in service separate from add/update.
      // Let's import teamService here or assume onSave handles it?
      // The prompt said "Update AdminTeamDialog with File Input... On Save -> upload -> get URL".
      // Since we can't easily change the prop signature without changing parent, let's do the upload here explicitly using the service.
      // But we need to import teamService (it is available).

      try {
        // Dynamic import to avoid circular dep
        const { teamService } = await import('../../services/teamService');
        const url = await teamService.uploadTeamMemberPhoto(photoFile);
        data.photoUrl = url;
      } catch (error) {
        console.error('Upload failed', error);
        alert(t('admin.team.upload_error'));
        return;
      }
    }
    await onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialData ? t('admin.team.title_edit') : t('admin.team.title_new')}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label={t('admin.common.name')}
              fullWidth
              required
              {...register('name', { required: true })}
            />
            <TextField
              select
              label={t('admin.team.gender')}
              fullWidth
              {...register('gender')}
              defaultValue="female"
            >
              <MenuItem value="female">{t('admin.team.female')}</MenuItem>
              <MenuItem value="male">{t('admin.team.male')}</MenuItem>
            </TextField>
            <TextField
              label={t('admin.team.order')}
              type="number"
              sx={{ width: 150 }}
              {...register('order', { valueAsNumber: true })}
            />
          </Box>

          {/* Photo Upload */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button variant="outlined" component="label">
              {t('admin.team.photo_upload')}
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {photoFile ? photoFile.name : t('admin.team.no_file')}
            </Typography>
          </Box>
          {/* Email Field */}
          <TextField
            label={t('admin.common.email')}
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            {...register('email')}
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            {t('admin.team.section_multilingual')}
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="language tabs"
            sx={{ mb: 2 }}
          >
            <Tab label="English" />
            <Tab label="Français" />
            <Tab label="Deutsch" />
          </Tabs>

          {/* English Tab */}
          <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <TextField label="Role (EN)" fullWidth sx={{ mb: 2 }} {...register('role.en')} />
            <TextField
              label="Bio (EN)"
              fullWidth
              multiline
              rows={4}
              {...register('bio.en')}
              helperText={t('admin.country.content_helper')}
            />
          </Box>

          {/* French Tab */}
          <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
            <TextField label="Role (FR)" fullWidth sx={{ mb: 2 }} {...register('role.fr')} />
            <TextField
              label="Bio (FR)"
              fullWidth
              multiline
              rows={4}
              {...register('bio.fr')}
              helperText={t('admin.country.content_helper')}
            />
          </Box>

          {/* German Tab */}
          <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
            <TextField label="Role (DE)" fullWidth sx={{ mb: 2 }} {...register('role.de')} />
            <TextField
              label="Bio (DE)"
              fullWidth
              multiline
              rows={4}
              {...register('bio.de')}
              helperText={t('admin.country.content_helper')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('admin.common.cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('admin.common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminTeamDialog;
