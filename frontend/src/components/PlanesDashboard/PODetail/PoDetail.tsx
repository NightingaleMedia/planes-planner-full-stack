import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
    CardContent,
    CardHeader,
    LinearProgress,
    Typography,
    Box,
} from '@material-ui/core'
import PoDetailHeader from './PoDetailHeader'
import PoDetailModule from './PoDetailModule'
import { DashboardCard } from 'src/components/dashboard/Dashboard__Styles/StyledCard'
import { ShipUnitAndPlanLoad } from 'pages/shipping-units/[purchaseOrderId]'
import useApiQuery from 'src/hooks/useApiQuery'
import ErrorModule from '../ErrorModule'
import GreyBoxes from 'src/atoms/GreyBoxes'
import PoDetailModule__Loading from './Loading/PoDetailModule__Loading'
import PoDetailHeader__Loading from './Loading/PoDetailHeader__Loading'
import { LOCKED_STATUS, POStatuses } from 'src/constants'
import Module from '../Module'
import ShortShipAlert from '../PrepareItems/ShortShipAlert'
import { POResponse } from 'pages/api/purchase-orders/[PurchaseOrderId]'

type PoDetail__Props = {
    purchaseOrderId: number
}

const PoLoading = () => {
    return (
        <DashboardCard>
            <LinearProgress />
            <CardHeader
                title={<GreyBoxes number={2} />}
                subheader={<PoDetailHeader__Loading />}
            />
            <CardContent>
                <PoDetailModule__Loading />
            </CardContent>
        </DashboardCard>
    )
}

type UsePOResponse = {
    error: any
    loading: boolean
    data: POResponse
}

const PoDetail = ({ purchaseOrderId }: PoDetail__Props): any => {
    if (!purchaseOrderId) return <PoLoading />
    const router = useRouter()
    const { error, loading, data }: UsePOResponse = useApiQuery({
        path: `/purchase-orders/${purchaseOrderId}`,
    })

    const selectedIndex = useMemo(() => {
        if (!router.query.index) {
            return 1
        }
        if (router.query.index.length > 1) {
            return Number(router.query.index[0])
        } else {
            return Number(router.query.index)
        }
    }, [router.query])

    // TODO hhandle the state change
    const [selectedUnit, setSelectedUnit] = useState<ShipUnitAndPlanLoad>({
        planLoad: null,
        unit: null,
    })

    if (loading) return <PoLoading />

    if (error) {
        return <ErrorModule error={error} />
    }
    if (data && !error) {
        const poData = data.purchaseOrder
        const loads = data.Loads
        return (
            <Module
                title={`${poData.BusinessUnit} ${poData.PurchaseOrderNbr}`}
                subtitle={
                    <>
                        <Typography variant={'subtitle1'}>
                            ID#: {poData.PurchaseOrderId}
                        </Typography>
                        {data.numLoads > 1 && (
                            <Typography
                                variant={'subtitle1'}
                                sx={{ fontWeight: 800 }}
                            >
                                Plan Load {selectedIndex || '1'} of{' '}
                                {data.numLoads}
                            </Typography>
                        )}
                    </>
                }
            >
                <DashboardCard>
                    <CardHeader
                        subheader={
                            <PoDetailHeader
                                selectedPlanLoad={loads[selectedIndex - 1]}
                                poData={poData}
                                locked={LOCKED_STATUS.includes(poData.POStatus)}
                            />
                        }
                    />
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <ShortShipAlert Loads={data.Loads} />
                        </Box>

                        <PoDetailModule
                            locked={LOCKED_STATUS.includes(poData.POStatus)}
                            status={poData.POStatus as POStatuses}
                            loading={loading}
                            selectedUnit={selectedUnit}
                            businessUnit={poData.BusinessUnit}
                            purchaseOrderId={poData.PurchaseOrderId}
                            purchaseOrderNbr={Number(poData.PurchaseOrderNbr)}
                        />
                    </CardContent>
                </DashboardCard>
            </Module>
        )
    }
}

PoDetail.propTypes = {}

export default PoDetail
