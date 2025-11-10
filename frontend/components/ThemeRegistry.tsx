'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007DFA',
    },
    secondary: {
      main: '#F57C00',
    },
    success: {
      main: '#00B894',
      light: '#00B89414',
    },
    warning: {
      main: '#F57C00',
      light: '#FFF3E0',
    },
    error: {
      main: '#EC5962',
      light: '#FDF2F2',
    },
    info: {
      main: '#3069FE',
      light: '#EEF3FF',
    },
    text: {
      primary: '#000000',
      secondary: '#999999',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    h1: {
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      color: '#AEAEAE',
    },
    subtitle1: {
      fontSize: '15px',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: '13px',
      fontWeight: 500,
      color: '#87888C',
    },
    caption: {
      fontSize: '13px',
      fontWeight: 400,
      color: '#87888C',
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
