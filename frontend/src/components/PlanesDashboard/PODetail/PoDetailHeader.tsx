import { Box, Grid, Typography, Button } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { styled } from '@material-ui/styles'
import DateParse from '../../Assets/DateParse'

import Status from './Status'
import { PurchaseOrders } from '.prisma/client'
import Address from './Address'

export const HeaderBox = styled(Box)({
    margin: '1rem 0.5rem',

    '&.status': {
        textAlign: 'left',
    },
    '&.dates': {
        justifySelf: 'flex-end',
        textAlign: 'right',
    },
    '& .MuiTypography-h3': {
        fontSize: '1rem',
    },
    '& .MuiButton-root': {
        minWidth: '100px',
        boxShadow: 'none',
    },
    '@media all and (max-width: 600px)': {
        '&.dates': {
            textAlign: 'left',
        },
    },
})

type PoDetailHeader__Props = {
    poData: PurchaseOrders
    locked: boolean
    selectedPlanLoad: {
        PurchaseOrderId: number
        PurchaseOrderIndex: number
        PlanLoadId: number
        LoadName: string
    }
}

const PoDetailHeader = ({
    poData,
    locked,
    selectedPlanLoad,
}: PoDetailHeader__Props): any => {
    return (
        <div style={{ maxWidth: '1000px', marginTop: '1rem' }}>
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
            >
                <Grid item sm={3} xs={12}>
                    <HeaderBox className="status">
                        <Status
                            planLoadId={selectedPlanLoad?.PlanLoadId}
                            purchaseOrderId={poData?.PurchaseOrderId}
                        />
                    </HeaderBox>
                    <HeaderBox className="status">
                        <Box
                            sx={{
                                mt: 4,
                                backgroundColor: 'background.default',
                                padding: '1rem',
                                marginLeft: '-1rem',
                                boxShadow: 0,
                                borderRadius: 1,
                                maxWidth: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Link
                                href={`/shipping-units/${poData.PurchaseOrderId}`}
                            >
                                <Button
                                    sx={{ mb: 2 }}
                                    disabled={locked}
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                >
                                    Detailed Ship
                                </Button>
                            </Link>

                            <Link
                                href={`/quick-ship/${poData.PurchaseOrderId}`}
                            >
                                <Button
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Quick Ship
                                </Button>
                            </Link>
                            <Link href={'/orders'}>
                                <Button
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    variant="outlined"
                                    color="primary"
                                >
                                    All Orders
                                </Button>
                            </Link>
                        </Box>
                    </HeaderBox>
                </Grid>
                <Grid item sm={3} xs={6}>
                    <HeaderBox>
                        <Typography variant="h5">Vendor</Typography>
                        <Typography>
                            {poData.VendorName}
                            <br />
                            ID: {poData.VendorId}
                        </Typography>
                    </HeaderBox>
                    <HeaderBox>
                        <Typography variant="h5">Business Unit</Typography>
                        <Typography>{poData.BusinessUnit}</Typography>
                    </HeaderBox>
                    <HeaderBox>
                        <Typography variant="h5">Plan Load</Typography>
                        <Typography>
                            Name: {selectedPlanLoad?.LoadName}
                        </Typography>
                        <Typography>
                            Id: {selectedPlanLoad?.PlanLoadId}
                        </Typography>
                    </HeaderBox>
                </Grid>
                <Grid item sm={3} xs={6}>
                    <HeaderBox>
                        <Typography variant="h5">Ship To</Typography>
                        <Address PoLocationId={poData.POLocationId} />
                    </HeaderBox>
                    <HeaderBox>
                        <Typography variant="h5">PO Reference</Typography>
                        <Typography>{poData.PurchaseOrderReference}</Typography>
                    </HeaderBox>
                </Grid>
                <Grid item sm={3} xs={12}>
                    <HeaderBox className="dates">
                        <Typography variant="h5">Issue Date</Typography>
                        <Typography>
                            <DateParse>{poData.PurchaseOrderDate}</DateParse>
                        </Typography>

                        <Typography variant="h5">Ship Date</Typography>
                        <Typography>
                            {poData.ShipDt ? (
                                <DateParse>
                                    {poData.PurchaseOrderDate}
                                </DateParse>
                            ) : (
                                'Not Available'
                            )}
                        </Typography>

                        <Typography variant="h5">Due Date</Typography>
                        <Typography>
                            <DateParse>{poData.PurchaseOrderDueDate}</DateParse>
                        </Typography>
                    </HeaderBox>
                </Grid>
            </Grid>
        </div>
    )
}

export default PoDetailHeader
