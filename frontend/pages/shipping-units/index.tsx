import React from 'react'
import Home from '..'
import { Card, Grid } from '@material-ui/core'
const ShipHome = () => (
    <Grid container spacing={3}>
        <Grid item md={8}>
            <Card sx={{ height: '350px' }}>List of Open POs</Card>
        </Grid>
        <Grid item md={4}>
            <Card sx={{ height: '350px' }}>List of POs</Card>
        </Grid>
        <Grid item md={12}>
            <Card sx={{ height: '350px' }}>
                List of All Open Shipping Units
            </Card>
        </Grid>
    </Grid>
)

ShipHome.propTypes = {}

export default ShipHome
