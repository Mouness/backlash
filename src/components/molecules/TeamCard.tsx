import React from 'react';
import { Box, Card, IconButton, Typography, useTheme } from '@mui/material';
import Face3Icon from '@mui/icons-material/Face3';
import Face6Icon from '@mui/icons-material/Face6';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { TeamMember } from '../../types/models';

interface TeamCardProps {
  member: TeamMember;
  canEdit: boolean;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, canEdit, onEdit, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  return (
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
      {canEdit && member.id && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(member);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(member.id!);
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
  );
};

export default TeamCard;
