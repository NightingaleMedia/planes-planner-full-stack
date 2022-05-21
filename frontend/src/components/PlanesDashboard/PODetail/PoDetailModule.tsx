import React from 'react'
import {
    Box,
    Card,
    Typography,
    Tabs,
    Tab,
    AppBar,
    LinearProgress,
    Button,
} from '@material-ui/core'
import { ItemsToShipTable } from '../PrepareItems'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { ItemsPreparedToShipModule } from '../ItemsPreparedToShip'

import { ShipUnitAndPlanLoad } from 'pages/shipping-units/[purchaseOrderId]'
import AlertCard from '../AlertCard'
import ShippingUnitMap from '../ShippingUnitIndex/ShippingUnitMap'
import { getEnumFromKey } from 'utils/getEnumFromKey'
import { POStatuses } from 'src/constants'

interface TabPanelProps {
    children?: React.ReactNode
    index: any
    value: any
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'div'}>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'none',
    },
    appBar: {
        backgroundColor: theme.palette.background.default,
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.info.main,
        },
        '& .Mui-selected': {
            color: theme.palette.info.main,
            backgroundColor: 'rgba(255,255,255,0.5)',
        },
    },
}))

type PoDetailModule__Props = {
    loading: boolean
    purchaseOrderId: number
    purchaseOrderNbr: number
    businessUnit: string
    selectedUnit: ShipUnitAndPlanLoad
    locked: boolean
    status: POStatuses
}

const PoDetailModule = ({
    purchaseOrderId,
    purchaseOrderNbr,
    businessUnit,
    selectedUnit,
    locked,
    status,
    loading,
}: PoDetailModule__Props) => {
    const router = useRouter()
    const classes = useStyles()
    const [value, setValue] = React.useState(0)
    const handleChange = (event: any, newValue: number) => {
        setValue(newValue)
    }

    if (loading) {
        return (
            <div className={classes.root}>
                <LinearProgress />
            </div>
        )
    }
    return locked ? (
        <>
            <AlertCard title={'This Purchase Order is Locked'}>
                This purchase order has a status of{' '}
                <strong>{getEnumFromKey(POStatuses, status)}</strong>, if you
                need to make changes to this please contact the Planes team.
                <Button
                    variant="outlined"
                    onClick={() => router.push('/orders/status/open')}
                >
                    Back To All Orders
                </Button>
            </AlertCard>
            {/* TODO make the index respond to the current order */}
            <ShippingUnitMap index={1} purchaseOrderId={purchaseOrderId} />
        </>
    ) : (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="items to ship and prepared shipping units"
                >
                    <Tab label="Items to Ship" {...a11yProps(0)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Card>
                    <ItemsToShipTable purchaseOrderId={purchaseOrderId} />
                </Card>
            </TabPanel>
        </div>
    )
}

export default PoDetailModule
