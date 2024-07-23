import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e2de2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    h4: {
      marginBottom: '16px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          background: 'linear-gradient(45deg, #8e2de2 30%, #4a00e0 90%)',
          color: '#fff',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'linear-gradient(45deg, #8e2de2 30%, #4a00e0 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
          padding: '1rem',
        },
      },
    },
  },
});

export default theme;
