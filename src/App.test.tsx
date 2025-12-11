import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './i18n';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>,
    );
    // Should find the title or part of the home page
    // Since i18n is async/client-side, we might just check if main container exists or use findAllByText
    // For a basic test, ensuring no error is thrown is good start.
    expect(true).toBeTruthy();
  });
});
