import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import { contactService } from '../services/contactService';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactService.addMessage(data);
      setSnackbar({ open: true, message: t('contact.form.success'), severity: 'success' });
      reset();
    } catch (error) {
      console.error('Failed to send message', error);
      setSnackbar({ open: true, message: t('contact.form.error'), severity: 'error' });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh' }}>
      {/* Full Width Map */}
      <Box sx={{ width: '100%', height: 400, bgcolor: 'grey.200' }}>
        <iframe
          // OpenStreetMap to keep for switch as we need Google API key for google Map src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2729.055866164746!2d6.929264315609425!3d46.990264979148675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e09f58c730001%3A0xc30c42767098418e!2sUniversit%C3%A9%20de%20Neuch%C3%A2tel!5e0!3m2!1sen!2sch!4v1625667823456!5m2!1sen!2sch"
          src="https://maps.google.com/maps?q=Avenue+du+1er-Mars+26,+2000+Neuchâtel,+Switzerland&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map"
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 6, color: 'primary.main' }}
        >
          {t('nav.contact')}
        </Typography>

        <Grid container spacing={6}>
          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('contact.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t('contact.intro')}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Typography>{t('contact.address')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography>{t('contact.email')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Typography>{t('contact.phone')}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('contact.form.title')}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: t('contact.form.required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('contact.form.name')}
                          fullWidth
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: t('contact.form.required'),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t('contact.form.invalid_email'),
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('contact.form.email')}
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="subject"
                      control={control}
                      rules={{ required: t('contact.form.required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('contact.form.subject')}
                          fullWidth
                          error={!!errors.subject}
                          helperText={errors.subject?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="message"
                      control={control}
                      rules={{ required: t('contact.form.required') }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('contact.form.message')}
                          fullWidth
                          multiline
                          rows={4}
                          error={!!errors.message}
                          helperText={errors.message?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<SendIcon />}
                      disabled={isSubmitting}
                      fullWidth
                      sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                      {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
