// Palette Definitions
// Palette Definitions
const SCORE_COLORS = {
  UNKNOWN: '#3c474cff', // Dark Blue Grey
  NO_DATA: '#71848eff', // Muted Blue Grey (Technical, good contrast)
  VERY_LOW: '#C62828', // Deep Red
  LOW: '#EF6C00', // Deep Orange
  MODERATE: '#F9A825', // Ochre (Retained)
  HIGH: '#43A047', // Standard Green
  VERY_HIGH: '#1B5E20', // Deep Emerald (Prestige Green, not Teal)
};

export const DemocraticScore = {
  UNKNOWN: 'UNKNOWN',
  VERY_LOW: 'VERY_LOW',
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
} as const;

export type DemocraticScore = (typeof DemocraticScore)[keyof typeof DemocraticScore];

export type ScoreColor = 'default' | 'error' | 'warning' | 'info' | 'success';

export interface ScoreLevel {
  key: string;
  color: ScoreColor;
  style: {
    backgroundColor: string;
    color: string;
  };
}

export const getScoreLevel = (score: DemocraticScore | undefined | null | string): ScoreLevel => {
  if (!score || score === DemocraticScore.UNKNOWN) {
    return {
      key: 'admin.country.score_levels.unknown',
      color: 'default',
      style: { backgroundColor: SCORE_COLORS.UNKNOWN, color: '#FFFFFF' },
    };
  }

  switch (score) {
    case DemocraticScore.VERY_LOW:
      return {
        key: 'admin.country.score_levels.very_low',
        color: 'error',
        style: { backgroundColor: SCORE_COLORS.VERY_LOW, color: '#FFFFFF' },
      };
    case DemocraticScore.LOW:
      return {
        key: 'admin.country.score_levels.low',
        color: 'warning',
        style: { backgroundColor: SCORE_COLORS.LOW, color: '#000000' },
      };
    case DemocraticScore.MODERATE:
      return {
        key: 'admin.country.score_levels.moderate',
        color: 'info',
        style: { backgroundColor: SCORE_COLORS.MODERATE, color: '#000000' },
      };
    case DemocraticScore.HIGH:
      return {
        key: 'admin.country.score_levels.high',
        color: 'success',
        style: { backgroundColor: SCORE_COLORS.HIGH, color: '#000000' },
      };
    case DemocraticScore.VERY_HIGH:
      return {
        key: 'admin.country.score_levels.very_high',
        color: 'success',
        style: { backgroundColor: SCORE_COLORS.VERY_HIGH, color: '#FFFFFF' },
      };
    default:
      return {
        key: 'admin.country.score_levels.unknown',
        color: 'default',
        style: { backgroundColor: SCORE_COLORS.UNKNOWN, color: '#FFFFFF' },
      };
  }
};
