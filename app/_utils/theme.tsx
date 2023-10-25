'use client'

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#718DF0', // Main card color
    },
    secondary: {
      main: '#C5D2FFEB', // Button color
    },
    text: {
      primary: '#000000',
    },
  }
});

export default theme;

