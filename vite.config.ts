/// <reference types="vitest" />
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  // @ts-expect-error - Vitest types are valid but Vite config type definition might conflict
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.tsx',
  },
});
