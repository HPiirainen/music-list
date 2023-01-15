import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const colors = {
    black: '#100007',
    white: '#fff',
    red: '#d7263d',
    yellow: '#e4ff1a',
    green: '#5eeb5b',
    blue: '#7f96ff',
    tamarind: '#2f1522',
};

const headingFontFamilies = [
    'Playfair Display',
    'serif',
];

const globalStyles = {
};

const components = {
    // Set global styles
    MuiCssBaseline: {
        styleOverrides: {
            '@global': globalStyles,
        }
    },
    MuiAccordion: {
        styleOverrides: {
            root: {
                backgroundColor: colors.tamarind,
                border: `1px solid ${alpha(colors.yellow, .5)}`,
                '&:before': {
                    display: 'none',
                },
            },
        }
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
        }
    },
    MuiBackdrop: {
        styleOverrides: {
            root: {
                backgroundColor: alpha(colors.black, .75),
            },
        }
    },
    MuiButton: {
        styleOverrides: {
            label: {
                fontWeight: 600,
            },
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: colors.tamarind,
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            label: {
                fontWeight: 600,
            },
        }
    },
    MuiDialogContentText: {
        styleOverrides: {
            root: {
                color: colors.white,
            },
        }
    },
    MuiSvgIcon: {
        styleOverrides: {
            fontSizeLarge: {
                fontSize: '3rem',
            },
        }
    },
    MuiTab: {
        styleOverrides: {
            root: {
                fontFamily: headingFontFamilies,
                fontSize: '1.25rem',
                textTransform: 'none',
            },
        }
    },
};

const Theme = createTheme(adaptV4Theme({
    components,
    typography: {
        fontFamily: [
            'Raleway',
            'Roboto',
            'Helvetica',
            'Arial',
            'sans-serif',
        ],
        headingFontFamily: headingFontFamilies,
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
        custom: colors,
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
            highlights: colors.yellow,
        },
        divider: 'rgba(255, 255, 255, .65)',
    }
}));

export default Theme;
