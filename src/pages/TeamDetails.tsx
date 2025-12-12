import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import { teamService } from '../services/teamService';
import type { TeamMember } from '../services/teamService';
import AdminTeamDialog from '../components/organisms/AdminTeamDialog';
import Face3Icon from '@mui/icons-material/Face3';
import Face6Icon from '@mui/icons-material/Face6';

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { teamMembers, loadingTeam, refreshTeam } = useData();
  const { currentUser } = useAuth();
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const member = teamMembers.find((m) => m.id === id);

  const handleUpdate = async (data: Omit<TeamMember, 'id'>) => {
    if (!member || !member.id) return; // Added !member.id check
    try {
      await teamService.updateTeamMember(member.id, data);
      await refreshTeam();
      // Member data will update automatically via context
    } catch (error) {
      console.error('Failed to update team member', error);
      alert('Failed to update team member');
    }
  };

  const handleDelete = async () => {
    if (member && member.id && window.confirm(t('admin.common.confirm_delete'))) { // Combined checks and updated translation key
      try {
        await teamService.deleteTeamMember(member.id);
        await refreshTeam();
        navigate('/team');
      } catch (error) {
        console.error('Failed to delete team member', error);
        alert('Failed to delete team member');
      }
    }
  };

  if (loadingTeam) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Member not found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/team')}>
          {t('team.back_to_list')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/team')} color="inherit">
          {t('team.back_to_list')}
        </Button>
        {currentUser && (
          <Box>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              {t('admin.common.edit')}
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              {t('admin.common.delete')}
            </Button>
          </Box>
        )}
      </Box>

      <Paper elevation={0} sx={{ p: 0, overflow: 'hidden', borderRadius: 0, border: '1px solid #E0E0E0' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Column: Image & Contact */}
          <Box
            sx={{
              width: { xs: '100%', md: '33.33%' },
              bgcolor: 'primary.light',
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'primary.contrastText',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid white',
                boxShadow: 3,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
              }}
            >
              {member.photoUrl ? (
                <Box
                  component="img"
                  src={member.photoUrl}
                  alt={member.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : member.gender === 'female' ? (
                <Face3Icon sx={{ fontSize: 120, color: theme.palette.primary.main }} />
              ) : (
                <Face6Icon sx={{ fontSize: 120, color: theme.palette.primary.main }} />
              )}
            </Box>

            <Typography variant="h5" fontWeight="bold" textAlign="center">
              {member.name}
            </Typography>
            <Typography variant="subtitle1" textAlign="center" sx={{ opacity: 0.9, mb: 4 }}>
              {member.role[currentLang] || member.role['en']}
            </Typography>

            {member.email && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  px: 2,
                  py: 1,
                  borderRadius: 0,
                }}
              >
                <EmailIcon fontSize="small" />
                <Typography variant="body2">{member.email}</Typography>
              </Box>
            )}
          </Box>

          {/* Right Column: Bio & Info */}
          <Box sx={{ p: 6, flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              {t('team.bio')}
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: 'secondary.main', mb: 4 }} />

            <Typography
              variant="body1"
              paragraph
              sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.primary' }}
            >
              {member.bio ? member.bio[currentLang] || member.bio['en'] : t('team.no_bio')}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <AdminTeamDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleUpdate}
        initialData={member}
      />
    </Container>
  );
};

export default TeamDetails;
