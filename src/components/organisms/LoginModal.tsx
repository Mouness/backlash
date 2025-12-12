import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const schema = yup
  .object({
    email: yup
      .string()
      .email('login_form.validation_email')
      .required('login_form.validation_required'),
    password: yup.string().required('login_form.validation_required'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      reset(); // Clear form
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err);
      setError(t('login_form.error_generic'));
    }
  };

  const handleClose = () => {
    setError('');
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {t('nav.login')}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('login_form.email_label')}
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={
              errors.email?.message
                ? t(errors.email.message, { field: t('login_form.email_label') })
                : ''
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label={t('login_form.password_label')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={
              errors.password?.message
                ? t(errors.password.message, { field: t('login_form.password_label') })
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            {t('login_form.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? t('login_form.submitting') : t('login_form.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal;
