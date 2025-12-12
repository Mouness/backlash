import { describe, it, expect } from 'vitest';
import { getTheme } from '../../theme';

describe('Theme Generator', () => {
  it('should return light theme by default', () => {
    const theme = getTheme('light');
    expect(theme.palette.mode).toBe('light');
    expect(theme.palette.background.default).toBe('#F0F4F8');
  });

  it('should return dark theme when requested', () => {
    const theme = getTheme('dark');
    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.background.default).toBe('#0A1929');
    expect(theme.palette.primary.contrastText).toBe('#000000');
  });
});
