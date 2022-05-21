import React from 'react'
import PropTypes from 'prop-types'
import { createStyles, ThemeProvider } from '@material-ui/styles'
import { Card, makeStyles, Theme } from '@material-ui/core'
import { dashboardInner } from './dashboardInner.theme'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: 'white',
        '& .MuiCardHeader-title': {
            fontSize: '2rem',
        },
        boxShadow: theme.shadows[0],
    },
}))
const DashboardCard = ({ children }): any => {
    const classes = useStyles()
    return (
        <ThemeProvider theme={dashboardInner}>
            <Card className={classes.root}> {children}</Card>
        </ThemeProvider>
    )
}

DashboardCard.propTypes = {
    children: PropTypes.any,
}

export { DashboardCard }
