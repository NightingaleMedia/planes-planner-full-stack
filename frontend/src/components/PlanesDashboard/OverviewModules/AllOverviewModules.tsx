import { Grid, Typography } from '@material-ui/core'
import React from 'react'
import Clock from 'src/components/Assets/Clock'
import useAuth from 'src/hooks/useAuth'
import Module from '../Module'
import OpenOrdersModule from './OpenOrdersModule'
import QuickActionsModule from './QuickActionsModule'
import { dashboardInner } from '../../dashboard/Dashboard__Styles/dashboardInner.theme'
const AllOverviewModules = () => {
    const { user } = useAuth()
    return (
        <Grid container spacing={3}>
            <Grid item md={2} sm={12} xs={12}>
                <Typography variant={'body2'} style={{ color: '#181818' }}>
                    <Clock format={'dddd, MMMM D'} />
                </Typography>
                <Typography variant={'body2'} style={{ color: '#181818' }}>
                    <Clock format={'yyyy'} />
                </Typography>
            </Grid>
            <Grid item md={10} sm={12} xs={12}>
                <Module
                    title={`Welcome Back ${user.name}`}
                    subtitle={<Clock />}
                />
            </Grid>
            <Grid item md={8} sm={12} xs={12}>
                <OpenOrdersModule />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
                <QuickActionsModule />
            </Grid>
        </Grid>
    )
}

export default AllOverviewModules
