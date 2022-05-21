import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useApiQuery from '../../../hooks/useApiQuery'
import { Card, Grid, LinearProgress } from '@material-ui/core'
import { ItemsToShipTable } from './index'
import { ItemsPreparedToShipModule } from '../ItemsPreparedToShip'
import { ShippingUnitModule } from 'src/components/PlanesDashboard/ShippingUnit/ShippingUnitModule'
import { PlanLoads, PlanLoadShippingUnits } from '.prisma/client'
import { PurchaseOrderId__Props } from 'src/types'
import Meta from 'src/atoms/Meta'
import AlertCard from 'src/components/PlanesDashboard/AlertCard'
import LoadHeader from 'src/components/PlanesDashboard/Load/LoadHeader'
import { LOCKED_STATUS } from 'src/constants'
import toast from 'react-hot-toast'
import ShortShipAlert from './ShortShipAlert'
import ShippingUnitMap from '../ShippingUnitIndex/ShippingUnitMap'
import { useSWRConfig } from 'swr'

export type ShipUnitAndPlanLoad = {
    unit: PlanLoadShippingUnits | null
    planLoad: PlanLoads | null
}

const AllPrepareUnitsModule = ({
    purchaseOrderId,
}: PurchaseOrderId__Props): React.ReactNode | any => {
    const router = useRouter()

    const poIndex = useMemo(() => {
        if (!router.query.index) {
            return 1
        } else return Number(router.query.index)
    }, [router.query])

    const [hidden, setHidden] = useState(false)
    const [finalizeOpen, setFinalizeOpen] = useState(false)

    const [selectedShippingUnit, setSelectedShippingUnit] = useState<
        ShipUnitAndPlanLoad
    >({
        unit: null,
        planLoad: null,
    })
    const [editModuleOpen, setEditModuleOpen] = useState(false)

    const { error, loading, data, mutate } = useApiQuery({
        path: `/plan-loads/${purchaseOrderId}`,
    })

    // const { mutate } = useSWRConfig()

    useEffect(() => {
        if (data && data[0].POStatus) {
            if (LOCKED_STATUS.includes(data[0].POStatus)) {
                setHidden(true)
                router.push(`/orders/${purchaseOrderId}`)
            }
        }
    }, [data])

    useEffect(() => {
        if (finalizeOpen) {
            setHidden(true)
        }
        return () => setHidden(false)
    }, [finalizeOpen])

    if (loading) {
        return <LinearProgress />
    }

    if (error) {
        return (
            <Grid item sm={12} lg={12} xs={12}>
                <AlertCard title={'An Error Occured'}>
                    {error.message || 'An unknown error occured'}
                </AlertCard>
            </Grid>
        )
    }
    if (data) {
        const { BusinessUnit, PurchaseOrderNbr } = data[0]
        return (
            <>
                <Meta
                    title={
                        data
                            ? BusinessUnit + ' ' + PurchaseOrderNbr
                            : 'Loading...'
                    }
                />
                <Grid
                    container
                    spacing={3}
                    style={
                        hidden
                            ? { pointerEvents: 'none', filter: 'blur(10px)' }
                            : {}
                    }
                >
                    <>
                        <Grid item md={12} sm={12} xs={12}>
                            <LoadHeader
                                purchaseOrderId={purchaseOrderId}
                                businessUnit={BusinessUnit}
                                planLoadId={
                                    selectedShippingUnit?.planLoad?.PlanLoadId
                                }
                                purchaseOrderNbr={PurchaseOrderNbr}
                                loading={loading}
                                onFinalize={() => {
                                    toast.error('Not set up')
                                }}
                                finalizeOpen={finalizeOpen}
                                setFinalizeOpen={setFinalizeOpen}
                            />
                        </Grid>
                        {/* only shows if loads length > 0 */}
                        <Grid item md={12} sm={12} xs={12}>
                            <ShortShipAlert Loads={data} />
                        </Grid>

                        {data[poIndex - 1]?.LocationName === 'VENDOR' ? (
                            <>
                                <Grid item sm={12} lg={8} xs={12}>
                                    <Card>
                                        <ItemsPreparedToShipModule
                                            editModuleOpen={editModuleOpen}
                                            deleteUnitCallback={() =>
                                                setSelectedShippingUnit({
                                                    unit: null,
                                                    planLoad: null,
                                                })
                                            }
                                            index={poIndex || 1}
                                            businessUnit={BusinessUnit}
                                            purchaseOrderNbr={PurchaseOrderNbr}
                                            purchaseOrderId={purchaseOrderId}
                                            onChangeUnit={(unit, planLoad) =>
                                                setSelectedShippingUnit({
                                                    unit,
                                                    planLoad,
                                                })
                                            }
                                            selectedUnit={selectedShippingUnit}
                                        />
                                    </Card>
                                </Grid>
                                <Grid item lg={4} sm={12} xs={12}>
                                    <Card>
                                        <ShippingUnitModule
                                            editModuleOpen={editModuleOpen}
                                            setEditModuleOpen={v =>
                                                setEditModuleOpen(v)
                                            }
                                            shippingUnitId={
                                                selectedShippingUnit?.unit
                                                    ?.PlanLoadShippingUnitId
                                            }
                                            planLoadName={
                                                selectedShippingUnit?.planLoad
                                                    ?.LoadName || 'No Load Name'
                                            }
                                        />
                                    </Card>
                                </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Card>
                                        <ItemsToShipTable
                                            purchaseOrderId={purchaseOrderId}
                                        />
                                    </Card>
                                </Grid>
                            </>
                        ) : (
                            <Grid item sm={12} lg={12} xs={12}>
                                <ShippingUnitMap
                                    purchaseOrderId={purchaseOrderId}
                                    index={poIndex || 1}
                                />
                            </Grid>
                        )}
                    </>
                </Grid>
            </>
        )
    } else return <LinearProgress />
}

export default AllPrepareUnitsModule
