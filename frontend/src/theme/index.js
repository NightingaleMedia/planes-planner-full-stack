import merge from 'lodash/merge'
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { THEMES } from '../constants'
import { lightShadows, darkShadows } from './shadows'

export const baseOptions = {
    direction: 'ltr',
    components: {
        MuiAvatar: {
            styleOverrides: {
                fallback: {
                    height: '75%',
                    width: '75%',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box',
                },
                html: {
                    MozOsxFontSmoothing: 'grayscale',
                    WebkitFontSmoothing: 'antialiased',
                    height: '100%',
                    width: '100%',
                },
                body: {
                    height: '100%',
                },
                '#root': {
                    height: '100%',
                },
                '#nprogress .bar': {
                    zIndex: '2000 !important',
                },
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: {
                    variant: 'h3',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 'auto',
                    marginRight: '16px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
    typography: {
        button: {
            fontWeight: 600,
        },
        fontFamily:
            '"Roboto", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        h1: {
            fontWeight: 600,
            fontSize: '3.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: 'black',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
        },
        overline: {
            fontWeight: 600,
        },
    },
}

export const themesOptions = {
    [THEMES.DARK]: {
        components: {
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
                    },
                },
            },
        },
        palette: {
            background: {
                default: '#171c24',
                paper: '#222b36',
            },
            divider: 'rgba(145, 158, 171, 0.24)',
            error: {
                contrastText: '#ffffff',
                main: '#f44336',
                light: '#ff6347',
            },
            mode: 'dark',
            primary: {
                contrastText: '#ffffff',
                main: '#688eff',
            },
            success: {
                contrastText: '#ffffff',
                main: '#4caf50',
            },
            text: {
                primary: '#ffffff',
                secondary: '#919eab',
            },
            warning: {
                contrastText: '#ffffff',
                main: '#ff9800',
            },
            info: {
                main: '#2196f3',
            },
        },
        shadows: darkShadows,
    },
}

export const createCustomTheme = (config = {}) => {
    let themeOptions = themesOptions[config.theme]

    if (!themeOptions) {
        console.warn(new Error(`The theme ${config.theme} is not valid`))
        themeOptions = themesOptions[THEMES.DARK]
    }

    let theme = createTheme(
        merge(
            {},
            baseOptions,
            themeOptions,
            {
                ...(config.roundedCorners && {
                    shape: {
                        borderRadius: 8,
                    },
                }),
            },
            { direction: config.direction }
        )
    )

    if (config.responsiveFontSizes) {
        theme = responsiveFontSizes(theme)
    }

    return theme
}
