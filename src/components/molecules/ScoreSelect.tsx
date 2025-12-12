import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ScoreSelectProps {
    value: number | '';
    onChange: (value: number) => void;
}

const SCORE_OPTIONS = [
    { value: 0, labelKey: 'admin.country.score_levels.unknown' },
    { value: 15, labelKey: 'admin.country.score_levels.very_low' }, // <= 20
    { value: 30, labelKey: 'admin.country.score_levels.low' }, // <= 40
    { value: 50, labelKey: 'admin.country.score_levels.moderate' }, // <= 60
    { value: 70, labelKey: 'admin.country.score_levels.high' }, // <= 80
    { value: 90, labelKey: 'admin.country.score_levels.very_high' }, // > 80
];

const getRepresentativeScore = (score: number | undefined | ''): number => {
    if (score === '' || score === undefined || score === 0) return 0;
    if (score <= 20) return 15;
    if (score <= 40) return 30;
    if (score <= 60) return 50;
    if (score <= 80) return 70;
    return 90;
};

const ScoreSelect: React.FC<ScoreSelectProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="score-select-label">{t('admin.country.score')}</InputLabel>
            <Select
                labelId="score-select-label"
                value={getRepresentativeScore(value)}
                label={t('admin.country.score')}
                onChange={(e: SelectChangeEvent<number>) => onChange(Number(e.target.value))}
            >
                {SCORE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ScoreSelect;
