import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import Face3Icon from '@mui/icons-material/Face3';
import Face6Icon from '@mui/icons-material/Face6';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { teamService } from '../services/teamService';
import type { TeamMember } from '../services/teamService';
import { MOCK_TEAM } from '../data/mockTeam';
import AdminTeamDialog from '../components/organisms/AdminTeamDialog';
import { useTheme } from '@mui/material/styles';
import { ENABLE_MOCKS } from '../config';

const Team: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  // Use Shared Data Context
  const { teamMembers: members, loadingTeam: loading, refreshTeam } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);

  // No local fetch effect needed, context handle it.

  const handleOpenDialog = (member?: TeamMember) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleSave = async (memberData: Omit<TeamMember, 'id'>) => {
    try {
      if (editingMember && editingMember.id) {
        await teamService.updateTeamMember(editingMember.id, memberData);
      } else {
        await teamService.addTeamMember(memberData);
      }
      refreshTeam();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    // Direct execution without confirm
    try {
      await teamService.deleteTeamMember(id);
      refreshTeam();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert(t('team.delete_error'));
    }
  };

  // Initialization / Seeding function (Admin only)
  // Initialization / Seeding function (Admin only)
  const handleSeed = async () => {
    // Direct execution without confirm to avoid blocking
    alert(t('team.seed_start'));

    try {
      // Fetch existing to prevent duplicates
      const currentDocs = await teamService.getTeamMembers();
      const existingNames = new Set(currentDocs.map((m) => m.name));

      let addedCount = 0;
      for (const m of MOCK_TEAM) {
        if (!existingNames.has(m.name)) {
          await teamService.addTeamMember(m);
          addedCount++;
        }
      }
      await refreshTeam();
      if (addedCount > 0) {
        alert(t('team.seed_success', { count: addedCount }));
      } else {
        alert(t('team.seed_uptodate'));
      }
    } catch (error) {
      console.error('Error seeding team:', error);
      alert(t('team.seed_error', { error: String(error) }));
    }
  };

  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  // Check if we are displaying mocks (items without ID)
  const isShowingMocks = members.some((m) => !m.id);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
            {t('nav.team')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('home.team_preview.subtitle')}
          </Typography>
        </Box>

        {currentUser && (
          <Box>
            {ENABLE_MOCKS && (members.length === 0 || isShowingMocks) && (
              <Button variant="outlined" color="warning" onClick={handleSeed} sx={{ mr: 2 }}>
                {t('team.initialize_db')}
              </Button>
            )}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              {t('team.add_member')}
            </Button>
          </Box>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {members.map((member, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={member.id || index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 4,
                  boxShadow: 'none',
                  // borderRadius: 4, // REMOVED
                  border: '1px solid #E0E0E0',
                  position: 'relative',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate(`/team/${member.id}`)}
              >
                {currentUser && member.id && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(member);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(member.id!);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.light,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
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
                    <Face3Icon sx={{ fontSize: 70, color: theme.palette.primary.main }} />
                  ) : (
                    <Face6Icon sx={{ fontSize: 70, color: theme.palette.primary.main }} />
                  )}
                </Box>
                <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  {member.role[currentLang] || member.role['en']}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <AdminTeamDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editingMember}
      />
    </Container>
  );
};

export default Team;
