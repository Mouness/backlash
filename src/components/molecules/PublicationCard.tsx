import React from 'react';
import { Box, Card, Button, Chip, Link, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';
import type { Publication } from '../../types/models';
import {
  getLocalizedContent,
  getLocalizedText,
  extractTextFromTiptap,
} from '../../utils/dataUtils';

import type { User } from 'firebase/auth';

interface PublicationCardProps {
  publication: Publication;
  isLeft: boolean;
  currentUser: User | null;
  onEdit: (pub: Publication) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  month: string;
  year: number;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  isLeft,
  currentUser,
  onEdit,
  onDelete,
  onClick,
  month,
  year,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'news':
        return 'primary';
      case 'event':
        return 'secondary';
      case 'article':
        return 'info';
      case 'book':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'center', md: isLeft ? 'flex-end' : 'flex-start' },
        mb: { xs: 8, md: 0 },
        position: 'relative',
        width: '100%',
        mt: { md: '0' }, // Margin handled by parent map loop logic if needed, or consistent
      }}
    >
      {/* Center Date (Desktop only) */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '15%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Chip
          label={`${month} ${year}`}
          color="primary"
          size="small"
          variant="filled"
          sx={{
            fontWeight: 'bold',
            boxShadow: 3,
            border: `4px solid ${theme.palette.background.default}`,
            textTransform: 'uppercase',
            borderRadius: 0, // Sharp corners
          }}
        />
      </Box>

      {/* Card Container */}
      <Box
        sx={{
          width: { xs: '100%', md: '35%' },
          position: 'relative',
          mr: { md: isLeft ? '9%' : 0 },
          ml: { md: isLeft ? 0 : '9%' },
        }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            // borderRadius: 4, // REMOVED
            boxShadow: 'none', // Use thematic flat style
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8],
              zIndex: 10,
            },
          }}
          onClick={onClick}
        >
          {publication.imageUrl && (
            <Box
              sx={{
                height: 250,
                width: '100%',
                backgroundImage: `url(${publication.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}

          <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Chip
                label={publication.category.toUpperCase()}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                color={getCategoryColor(publication.category) as any}
                size="small"
                sx={{
                  borderRadius: 0,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                }}
              />
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {getLocalizedText(publication.title, currentLang)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {extractTextFromTiptap(getLocalizedContent(publication.description, currentLang))}
            </Typography>

            {publication.link && (
              <Button
                endIcon={<LaunchIcon />}
                component={Link}
                href={publication.link}
                target="_blank"
                sx={{ alignSelf: 'flex-start' }}
                onClick={(e) => e.stopPropagation()} // Prevent card click
              >
                {t('publications.read_more')}
              </Button>
            )}
          </Box>

          {currentUser && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper',
                borderRadius: 0,
                boxShadow: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(publication);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(publication.id!);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Card>

        {/* Arrow connection */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            transform: 'translateY(-50%)',
            [isLeft ? 'right' : 'left']: -16,
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            [isLeft ? 'borderLeft' : 'borderRight']: `10px solid ${theme.palette.background.paper}`,
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))',
            display: { xs: 'none', md: 'block' },
          }}
        />
      </Box>
    </Box>
  );
};

export default PublicationCard;
