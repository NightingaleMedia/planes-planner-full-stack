import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PlanLoadBuilderModule } from './index'
import type { PlanLoads, PlanLoadShippingUnits } from '.prisma/client'
import Module from '../Module'
import {Button} from '@material-ui/core'
import { PlanLoadItemResponse } from 'pages/api/plan-loads'
import {
    DeleteShippingUnit__Modal,
    CreateShippingUnit__Modal,
} from '../ShippingUnit'
import { PrepareItems__Modal } from '../PrepareItems'
import { ShipUnitAndPlanLoad } from 'pages/shipping-units/[purchaseOrderId]'
import { getPlanLoadByPo } from 'src/hooks/queries'

import AlertCard from '../AlertCard'
import ItemsPreparedToShipSubtitle from './ItemsPreparedToShipSubtitle'

type ItemsPreparedToShipModule__Props = {
    purchaseOrderNbr: number
    businessUnit: string
    purchaseOrderId: number
    selectedUnit: ShipUnitAndPlanLoad
    onChangeUnit: (id: PlanLoadShippingUnits, planLoad: PlanLoads) => void
    deleteUnitCallback: (id?: string | number )=>void
    index?: any
    editModuleOpen: boolean
}

export type PlanLoadItemList = {
    planLoad: PlanLoads
    shippingUnits: PlanLoadItemResponse[] | []
    correspondingPoDetails: any[]
}

export const ItemsPreparedToShipModule = ({
    purchaseOrderNbr,
    purchaseOrderId,
    onChangeUnit,
    deleteUnitCallback,
    selectedUnit,
    businessUnit,
    index,
    editModuleOpen,
}: ItemsPreparedToShipModule__Props): any => {

    if(!index){
        index = 1
    }
    const { error, loading, data, mutate } = getPlanLoadByPo(
        Number(purchaseOrderId), index
    )

    const [createUnitOpen, setCreateUnitOpen] = useState(false)
    const [deleteUnitOpen, setDeleteUnitOpen] = useState({
        open: false,
        id: null,
    })
    const [prepareItemsOpen, setPrepareItemsOpen] = useState({
        open: false,
        selectedUnit,
    })

    const [itemList, setItemList] = useState<PlanLoadItemList>({
        planLoad: null,
        shippingUnits: [],
        correspondingPoDetails: [],
    })
    useEffect(() => {
        if (data) {
            setItemList({
                planLoad: data.planLoad,
                shippingUnits: data.planLoadShippingUnits,
                correspondingPoDetails: data.correspondingPoDetails,
            })
        }
    }, [data])

    useEffect(()=>{
        if(!prepareItemsOpen.open || !editModuleOpen){
            mutate()
        }
    },[prepareItemsOpen.open, editModuleOpen])

    const handleChangeUnit = (id, planLoad) => {
        setPrepareItemsOpen((prev) => ({
            ...prev,
            selectedUnit: { unit: id, planLoad: planLoad },
        }))
        onChangeUnit(id, planLoad)
    }

    const refreshResults = () => {
        console.log('Refreshing results')
        mutate(`/plan-loads?purchaseOrderId=${purchaseOrderId}`)
    }

    useEffect(() => {
        refreshResults()
    }, [createUnitOpen])

    const handleDeleteUnit =  (id) => {
       refreshResults();
       deleteUnitCallback();
        
    }

    const handleCreateUnit = async () => {
        // first check if any are blank
        const empty = itemList?.shippingUnits?.filter(
            (unit: PlanLoadItemResponse) => unit.items.length === 0
        )
        if (!empty || empty.length > 0) {
            return toast.error(
                'You already have a shipping unit that has no items. \n Please fill that one out and then try again.'
            )
        }
        setCreateUnitOpen(true)
    }

    if (error) {
        return (
        <AlertCard title={'An Error Occured'}>
            {error.message || 'An unknown error occured'}
        </AlertCard>
        )
    }
    return (
        <Module
            title={'Items Prepared To Ship'}
            subtitle={<ItemsPreparedToShipSubtitle itemList={itemList} />}
        >
            <>
                <PlanLoadBuilderModule
                    loading={loading}
                    planLoad={itemList?.planLoad}
                    planLoadUnits={itemList?.shippingUnits}
                    correspondingPoDetails={itemList?.correspondingPoDetails}
                    refreshResults={refreshResults}
                    onChangeUnit={handleChangeUnit}
                    onAddItems={() =>
                        setPrepareItemsOpen((prev) => ({
                            ...prev,
                            open: true,
                        }))
                    }
                    onAddUnit={handleCreateUnit}
                    onDeleteUnit={(unitId) => { setDeleteUnitOpen({ open: true, id: unitId })}}
                />
                <CreateShippingUnit__Modal
                    planLoadId={itemList?.planLoad?.PlanLoadId}
                    open={createUnitOpen}
                    onCreate={(id) => {
                        toast.success(`Created Unit with ID: ${id}`)
                        mutate()
                    }}
                    setOpen={(value) => setCreateUnitOpen(value)}
                />
                <DeleteShippingUnit__Modal
                    shipUnitId={deleteUnitOpen.id}
                    open={deleteUnitOpen.open}
                    setOpen={(value) =>
                        setDeleteUnitOpen({ id: null, open: value })
                    }
                    onDelete={(id)=>handleDeleteUnit(id)}
                />
                <PrepareItems__Modal
                    unit={prepareItemsOpen.selectedUnit}
                    open={prepareItemsOpen.open}
                    setOpen={(value) =>
                        setPrepareItemsOpen((prev) => ({
                            ...prev,
                            open: value,
                        }))
                    }
                />
            </>
        </Module>
    )
}

export default ItemsPreparedToShipModule
