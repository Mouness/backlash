export type ScoreColor = 'default' | 'error' | 'warning' | 'info' | 'success';

export interface ScoreLevel {
  key: string;
  color: ScoreColor;
  // Specific style overrides if needed for "Very High" vs "High" differentiation beyond standard hues
  style?: React.CSSProperties;
}

export const getScoreLevel = (score: number | undefined): ScoreLevel => {
  if (score === undefined || score === null || score === 0) {
    return { key: 'admin.country.score_levels.unknown', color: 'default' };
  }

  if (score <= 20) {
    return { key: 'admin.country.score_levels.very_low', color: 'error' };
  }

  if (score <= 40) {
    return { key: 'admin.country.score_levels.low', color: 'warning' }; // Orange
  }

  if (score <= 60) {
    // Info often renders as light blue.
    // If standard warning/info colors aren't enough, custom colors can be returned,
    // but for Chip 'color' prop we stick to supported palette values.
    return { key: 'admin.country.score_levels.moderate', color: 'info' };
  }

  if (score <= 80) {
    return { key: 'admin.country.score_levels.high', color: 'success' };
  }

  return {
    key: 'admin.country.score_levels.very_high',
    color: 'success',
    style: { backgroundColor: '#1b5e20', color: '#fff' }, // Darker green for very high
  };
};
