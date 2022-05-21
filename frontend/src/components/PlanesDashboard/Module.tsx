import React from 'react'
import { Box, Paper, Toolbar, Typography } from '@material-ui/core'
import { tablesStyle } from './Styles/Table__Styles'
import { dashboardInner } from '../dashboard/Dashboard__Styles/dashboardInner.theme'
import ModuleMenu, { Action } from './ModuleMenu'
import { AnyIfEmpty } from 'react-redux'

type Module__Props = {
    title: string
    subtitle?: string | React.ReactNode
    children?: React.ReactChild | any
    actions?: Action[]
    styles?: any
}
const Module = ({
    title,
    subtitle,
    children,
    actions,
    styles = {},
}: Module__Props): any => {
    const classes: any = tablesStyle({ dashboardInner })

    return (
        <Paper className={classes.paper} style={{ ...styles }}>
            <Toolbar className={classes.header}>
                <Box className="headerText">
                    <Typography variant={'h3'}>{title}</Typography>
                    {typeof subtitle == 'string' ? (
                        <Typography variant={'subtitle1'}>
                            {subtitle}
                        </Typography>
                    ) : (
                        subtitle
                    )}
                </Box>
                <Box>
                    {actions && actions.length > 0 && (
                        <ModuleMenu actions={actions} />
                    )}
                </Box>
            </Toolbar>
            {children && <Box sx={{ mt: 1 }}>{children}</Box>}
        </Paper>
    )
}

export default Module
