import React, { useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { teamService } from '../services/teamService';
import type { TeamMember } from '../types/models';
import { MOCK_TEAM } from '../data/mockTeam';
import AdminTeamDialog from '../components/organisms/AdminTeamDialog';
import TeamCard from '../components/molecules/TeamCard';
import { ENABLE_MOCKS } from '../config';

const Team: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
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

  // Check if we are displaying mocks (items without ID or flagged as mock)
  const isShowingMocks = members.some((m) => !m.id || m.isMock);

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
              <TeamCard
                member={member}
                canEdit={!!currentUser}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
              />
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
