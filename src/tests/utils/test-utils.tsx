import React, { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from '../../theme';
import { DataProvider } from '../../contexts/DataContext';
import { AuthProvider } from '../../contexts/AuthContext';

export const MockProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DataProvider>{children}</DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const renderWithProviders = (
  ui: React.ReactElement,
  { route = '/', ...options }: RenderOptions & { route?: string } = {},
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <MockProviders>{ui}</MockProviders>
    </MemoryRouter>,
    options,
  );
};

export { renderWithProviders as render };
export * from '@testing-library/react';
