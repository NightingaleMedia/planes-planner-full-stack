import '@emotion/react'
import { Theme as LibTheme } from '@material-ui/core'

export type StyledProps = {
    theme: LibTheme
    [x: string]: any
}

// You are also able to use a 3rd party theme this way:

declare module '@material-ui/core/Button' {
    interface ButtonPropsColorOverrides {
        error: true
        success: true
        warning: true
        info: true
    }
}

declare module '@emotion/react' {
    export interface Theme extends LibTheme {
        [x: string]: any
    }
}
