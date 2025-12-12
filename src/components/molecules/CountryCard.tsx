import React from 'react';
import { Box, Card, CardContent, CardActions, IconButton, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import type { Country } from '../../services/countryService';
import { getScoreLevel } from '../../utils/scoreUtils';

import type { User } from 'firebase/auth';

interface CountryCardProps {
    country: Country;
    currentUser: User | null;
    onEdit: (country: Country) => void;
    onDelete: (id: string) => void;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, currentUser, onEdit, onDelete }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const currentLang = i18n.language.split('-')[0] as 'en' | 'fr' | 'de';

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                // borderRadius: 3, // REMOVED
                boxShadow: 'none',
                border: '1px solid #E0E0E0',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => navigate(`/countries/${country.id}`)}
        >
            {country.imageUrl && (
                <Box
                    sx={{
                        height: 200,
                        backgroundImage: `url(${country.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                    }}
                >
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        {country.name[currentLang] || country.name['en']}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Chip
                            label={t(getScoreLevel(country.score).key)}
                            color={getScoreLevel(country.score).color}
                            size="small"
                            variant={country.score && country.score > 0 ? 'filled' : 'outlined'}
                            sx={{
                                fontWeight: 'bold',
                                minWidth: 80,
                                height: 24,
                                borderRadius: 0, // Sharp corners for academic look
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                letterSpacing: '0.05em',
                                ...getScoreLevel(country.score).style,
                            }}
                        />
                    </Box>
                </Box>
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
                    {country.summary[currentLang] || country.summary['en']}
                </Typography>
            </CardContent>
            {currentUser && (
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(country);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(country.id);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            )}
        </Card>
    );
};

export default CountryCard;
