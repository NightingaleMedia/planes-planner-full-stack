import { blue } from '@material-ui/core/colors'
import { createTheme } from '@material-ui/core/styles'
import { merge } from 'lodash'
import { baseOptions, themesOptions } from '../../../theme/index'

const dashboardInitial = createTheme({
    palette: {
        background: {
            default: '#edf0f7',
            paper: '#f7f7f7',
        },
        text: {
            primary: '#39363c',
            secondary: '#867f8d',
        },
        primary: {
            main: '#7caa41',
            contrastText: 'white',
        },
        // PLANES BLUE
        secondary: {
            main: '#2867f2',
        },
        info: {
            main: '#2867f2',
        },
        success: {
            main: '#1ce792',
        },
    },
    typography: {
        body1: {
            color: '#867f8d',
            fontWeight: 200,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
            color: '#39363c',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#39363c',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#39363c',
        },
        h6: {
            color: '#39363c',
        },
    },
})

// inherit the old theme from before
const dashboardInner = merge(
    {},
    baseOptions,
    themesOptions['DARK'],
    dashboardInitial
)

export { dashboardInner }
