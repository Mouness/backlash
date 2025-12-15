import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import TeamLocalizedTabs from './TeamLocalizedTabs';
import CloseIcon from '@mui/icons-material/Close';
import type { TeamMember } from '../../types/models';
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

  const { register, handleSubmit, reset, setValue, control } = useForm<Omit<TeamMember, 'id'>>({
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: Omit<TeamMember, 'id'>) => {
    if (photoFile) {
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
              slotProps={{ htmlInput: { 'data-testid': 'team-name-input' } }}
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
            slotProps={{ htmlInput: { 'data-testid': 'team-email-input' } }}
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            {t('admin.team.section_multilingual')}
          </Typography>

          <TeamLocalizedTabs control={control} />
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
