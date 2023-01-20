import { Components, createTheme, Palette } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Allow custom colors.
declare module '@mui/material/styles' {
  interface Palette {
    black: Palette['primary'];
    white: Palette['primary'];
    red: Palette['primary'];
    yellow: Palette['primary'];
    green: Palette['primary'];
    blue: Palette['primary'];
    tamarind: Palette['primary'];
  }

  interface PaletteOptions {
    black: PaletteOptions['primary'];
    white: PaletteOptions['primary'];
    red: PaletteOptions['primary'];
    yellow: PaletteOptions['primary'];
    green: PaletteOptions['primary'];
    blue: PaletteOptions['primary'];
    tamarind: PaletteOptions['primary'];
  }
}

const colors = {
  black: '#100007',
  white: '#fff',
  red: '#d7263d',
  yellow: '#e4ff1a',
  green: '#5eeb5b',
  blue: '#7f96ff',
  tamarind: '#2f1522',
};

const headingFontFamilies = '"Playfair Display", "serif"';

const components: Components = {
  MuiAccordion: {
    styleOverrides: {
      root: {
        backgroundColor: colors.tamarind,
        border: `1px solid ${alpha(colors.yellow, 0.5)}`,
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      filledSuccess: {
        color: colors.black,
      },
      filledWarning: {
        color: colors.black,
      },
      filledInfo: {
        color: colors.black,
      },
    },
  },
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backgroundColor: alpha('#000', 0.75),
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: colors.tamarind,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      label: {
        fontWeight: 600,
      },
    },
  },
  MuiDialogContentText: {
    styleOverrides: {
      root: {
        color: colors.white,
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      fontSizeLarge: {
        fontSize: '3rem',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: headingFontFamilies,
        fontSize: '1.25rem',
        textTransform: 'none',
      },
    },
  },
  MuiInput: {
    styleOverrides: {
      root: {
        fontFamily: headingFontFamilies,
      },
    },
  },
};

const Theme = createTheme({
  components,
  typography: {
    fontFamily: 'Raleway, Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: headingFontFamilies,
      fontWeight: 500,
    },
    h2: {
      fontFamily: headingFontFamilies,
      fontWeight: 500,
    },
    h3: {
      fontFamily: headingFontFamilies,
      fontWeight: 500,
    },
    h4: {
      fontFamily: headingFontFamilies,
      fontWeight: 500,
    },
    h5: {
      fontFamily: headingFontFamilies,
      fontWeight: 500,
    },
    h6: {
      fontFamily: headingFontFamilies,
      fontWeight: 500,
    },
  },
  palette: {
    black: {
      main: colors.black,
    },
    white: {
      main: colors.white,
    },
    red: {
      main: colors.red,
    },
    yellow: {
      main: colors.yellow,
    },
    green: {
      main: colors.green,
    },
    blue: {
      main: colors.blue,
    },
    tamarind: {
      main: colors.tamarind,
    },
    mode: 'dark',
    background: {
      paper: colors.tamarind,
      default: colors.black,
    },
    common: {
      black: colors.black,
      white: colors.white,
    },
    primary: {
      main: colors.yellow,
      contrastText: colors.black,
    },
    secondary: {
      main: colors.red,
    },
    error: {
      main: colors.red,
    },
    warning: {
      main: colors.yellow,
      contrastText: colors.black,
    },
    info: {
      main: colors.blue,
      contrastText: colors.black,
    },
    success: {
      main: colors.green,
      contrastText: colors.black,
    },
    text: {
      primary: colors.white,
      secondary: colors.white,
      // highlights: colors.yellow,
    },
    divider: 'rgba(255, 255, 255, .65)',
  },
});

export default Theme;
