import React, { useEffect, useState } from 'react'

import { Button, Typography } from '@material-ui/core'
import { PlanLoadShippingUnitDetails } from '.prisma/client'
import { AddCircle } from '@material-ui/icons'
import toast from 'react-hot-toast'
import { ShippingUnitLineItem } from '.'
import addItemQuery from 'src/hooks/queries/addItemQuery'
import { deleteItemFromSu } from 'src/hooks/queries'
import {
    StyledAddArea,
    StyledItemList__Header,
    StyledItemTitle,
    StyledTableBody,
} from '../Styles/LineItem__Styles'

export const SingleItemTitle = ({ title }: any): any => {
    return <StyledItemTitle className="item-id">{title}</StyledItemTitle>
}

type SingleItemDetail__Props = {
    correspondingPoDetails: any[]
    suItems?: PlanLoadShippingUnitDetails[]
    planLoadUnitId: number
    onAddItems: () => void
    refreshResults: () => void
}

export const SingleShippingUnitDetail = ({
    correspondingPoDetails,
    suItems,
    onAddItems,
    refreshResults,
}: SingleItemDetail__Props): any => {
    const { adding, addItems } = addItemQuery()
    const { deletingItem, deleteItem } = deleteItemFromSu()
    const [itemsToEdit, setItemsToEdit] = useState(null)
    const [order, setOrder] = useState({ loading: false, items: null })
    const [changesStaged, setChangesStaged] = useState(false)

    const initialize = () => {
        const transformed = suItems.map(i => {
            const corresItem = correspondingPoDetails.filter(
                item => item.ItemNbr === i.ItemNbr
            )
            const itemRemaining =
                ((corresItem[0].ItemQty as unknown) as number) -
                ((corresItem[0].FullFilledQty as unknown) as number)

            const itemQty = i.Qty
            return {
                ...i,
                itemQty,
                itemRemaining,
                quantityToAdd: 0,
            }
        })
        // compare is read only to see if there are changes
        setItemsToEdit([...transformed])
    }
    useEffect(() => {
        if (suItems.length > 0) {
            initialize()
        }
    }, [suItems])

    useEffect(() => {
        if (itemsToEdit && itemsToEdit?.length > 0) {
            const l = itemsToEdit.filter(i => i.quantityToAdd !== 0)
            setOrder({ loading: false, items: l })
            setChangesStaged(l.length >= 1)
        }
        setOrder(prev => ({ ...prev, loading: adding }))
    }, [itemsToEdit, adding])

    const handleStageItems = (uid: number, value: number) => {
        const iCopy = [...itemsToEdit]

        const itemIndex = iCopy.findIndex(
            i => i.PlanLoadShippingUnitDetailId === uid
        )

        const itemToChange = iCopy[itemIndex]

        if (value < 0 && itemToChange.itemQty === 0) {
            return toast.error('You cannot take any more off the SU')
        }

        if (value > 0 && itemToChange.itemRemaining <= 0) {
            return toast.error('No more remain')
        }
        itemToChange.quantityToAdd += value
        itemToChange.itemRemaining -= value
        itemToChange.itemQty += value
        iCopy.splice(itemIndex, 1, itemToChange)
        setItemsToEdit(iCopy)
    }

    const handleSubmit = async () => {
        const itemsToSubmit = [...order.items]
        setOrder(prev => ({ ...prev, loading: true }))
        toast.loading('Updating', {
            id: 'addingUnit',
        })

        addItems(itemsToSubmit, order.items[0].PlanLoadShippingUnitId)
            .then(() => {
                // look to see if we need to auto delete
                toast.success('Updated', {
                    id: 'addingUnit',
                })
            })
            .finally(() => refreshResults())
    }

    const handleDeleteItemFromSu = async i => {
        toast.loading(`Deleting all ${i.Qty} items from the shipping unit`, {
            id: 'deletingUnit',
        })
        deleteItem(i.PlanLoadShippingUnitId, i.ItemNbr)
            .then(res => {
                toast.success(res?.message, { id: 'deletingUnit' })
                refreshResults()
            })
            .catch(err => {
                toast.error(err.message, { id: 'deletingUnit' })
            })
    }

    const handleCancel = () => {
        initialize()
    }
    return (
        <StyledTableBody>
            {suItems?.length > 0 ? (
                <StyledItemList__Header>
                    <div>Item Information</div>
                    <div>Quantity</div>
                    <div className={'centered'}></div>
                </StyledItemList__Header>
            ) : (
                <Typography variant={'h5'}>No Items</Typography>
            )}
            <>
                {itemsToEdit?.map(i => (
                    <ShippingUnitLineItem
                        key={i.PlanLoadShippingUnitDetailId}
                        item={i}
                        correspondingPoDetails={correspondingPoDetails}
                        onDelete={() => handleDeleteItemFromSu(i)}
                        onCancel={handleCancel}
                        onValueChange={(value: number, shouldSave = false) =>
                            handleStageItems(
                                i.PlanLoadShippingUnitDetailId,
                                value
                            )
                        }
                        changesStaged={changesStaged}
                        submitCallback={handleSubmit}
                        loading={adding || deletingItem}
                    />
                ))}
            </>
            <StyledAddArea>
                <Button onClick={onAddItems}>
                    <Typography
                        variant={'body2'}
                        className="add-text"
                        style={{ display: 'inline' }}
                    >
                        ADD / EDIT
                    </Typography>
                    <AddCircle />
                </Button>
                <Button
                    className={`${changesStaged ? 'save' : 'disabled'}`}
                    onClick={handleSubmit}
                    disabled={!changesStaged}
                >
                    <Typography variant={'body2'}>
                        {order.loading ? 'LOADING' : 'SAVE'}
                    </Typography>
                </Button>
                {changesStaged && (
                    <Button className={'cancel'} onClick={handleCancel}>
                        <Typography variant={'body2'}>Cancel</Typography>
                    </Button>
                )}
            </StyledAddArea>
        </StyledTableBody>
    )
}

export default SingleShippingUnitDetail
