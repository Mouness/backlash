import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DemocraticScore } from '../../utils/scoreUtils';

interface ScoreSelectProps {
  value: DemocraticScore | '';
  onChange: (value: DemocraticScore | '') => void;
}

const SCORE_OPTIONS = [
  { value: 'VERY_HIGH', labelKey: 'admin.country.score_levels.very_high' },
  { value: 'HIGH', labelKey: 'admin.country.score_levels.high' },
  { value: 'MODERATE', labelKey: 'admin.country.score_levels.moderate' },
  { value: 'LOW', labelKey: 'admin.country.score_levels.low' },
  { value: 'VERY_LOW', labelKey: 'admin.country.score_levels.very_low' },
  { value: 'UNKNOWN', labelKey: 'admin.country.score_levels.unknown' },
];

const ScoreSelect: React.FC<ScoreSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id="score-select-label">{t('admin.country.score')}</InputLabel>
      <Select
        labelId="score-select-label"
        value={value}
        label={t('admin.country.score')}
        onChange={(e: SelectChangeEvent<string>) =>
          onChange(e.target.value as DemocraticScore | '')
        }
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
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
