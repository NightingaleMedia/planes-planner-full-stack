import { Prisma, PurchaseOrderDetails } from '.prisma/client'
import {
    Button,
    FormControlLabel,
    FormGroup,
    Switch,
    Typography,
} from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { QuantityHandler } from '../ItemsPreparedToShip'
import {
    AddRmButton,
    StyledItemList__Items,
    StyledQuan,
} from '../Styles/LineItem__Styles'

type SingleLineItem__Props = {
    item: PurchaseOrderDetails
    shippingUnitPreparedItems: any
    changesStaged: boolean
    onAdd: (item: any, quantity: number) => void
    onChangeStaged: (quantity: QuantityEdit) => void
}
export type QuantityEdit = {
    remaining: number
    amtOnUnit: number
    numberToAdd: number
}
// we are mapping all the items on the PoDetail

const SingleLineItem = ({
    item,
    shippingUnitPreparedItems,
    changesStaged,
    onAdd,
    onChangeStaged,
}: SingleLineItem__Props): React.ReactNode | any => {
    const computedNumber = useMemo(() => {
        const corres = shippingUnitPreparedItems.filter(
            d => d.ItemNbr === item.ItemNbr
        )[0] || { Qty: 0 }

        if (!item.FullFilledQty) {
            item.FullFilledQty = new Prisma.Decimal(0)
        }
        const remaining = Number(item.ItemQty) - Number(item.FullFilledQty)
        return { amtOnUnit: corres.Qty, remaining }
    }, [item])

    const [quantityEdit, setQuantityEdit] = useState<QuantityEdit>({
        remaining: computedNumber.remaining,
        amtOnUnit: computedNumber.amtOnUnit,
        numberToAdd: 0,
    })

    const [addAllSelected, setAddAllSelected] = useState(false)

    useEffect(() => {
        onChangeStaged(quantityEdit)
    }, [quantityEdit])

    useEffect(() => {
        if (addAllSelected) {
            const max = quantityEdit.remaining
            setQuantityEdit({
                numberToAdd: max,
                remaining: 0,
                amtOnUnit: max,
            })
        }
    }, [addAllSelected])

    useEffect(() => {
        const { remaining, amtOnUnit } = computedNumber
        setQuantityEdit(prev => ({ ...prev, remaining, amtOnUnit }))
    }, [shippingUnitPreparedItems])

    const initialize = () => {
        setQuantityEdit(prev => ({ ...prev, numberToAdd: 0 }))
    }
    const addToShipment = () => {
        let { remaining, numberToAdd } = { ...quantityEdit }

        if (remaining > 0) {
            numberToAdd += 1
            remaining -= 1
        } else {
            toast.error('No More To Add!')
        }

        setQuantityEdit(prev => ({ ...prev, remaining, numberToAdd }))
    }

    const removeFromShipment = () => {
        let { remaining, numberToAdd } = { ...quantityEdit }

        // first see if there is something on the unit and none staged
        if (quantityEdit.amtOnUnit > 0 && quantityEdit.numberToAdd === 0) {
            // if you are doing this then you have a max amount
            if (Math.abs(quantityEdit.numberToAdd) <= quantityEdit.amtOnUnit) {
                numberToAdd -= 1
                remaining += 1
            } else {
                toast.error('No more to remove')
            }
            // or if there something staged
        } else if (
            quantityEdit.numberToAdd > 0 ||
            Math.abs(quantityEdit.numberToAdd) < quantityEdit.amtOnUnit
        ) {
            // if you are doing this then you have a max amount
            numberToAdd -= 1
            remaining += 1
        } else {
            toast.error(
                `Cannot take that off more than ${quantityEdit.amtOnUnit}.`
            )
        }

        setQuantityEdit(prev => ({ ...prev, remaining, numberToAdd }))
    }

    const handleAdd = () => {
        onAdd(item, quantityEdit.numberToAdd)
        setQuantityEdit(prev => ({
            ...prev,
            numberToAdd: 0,
        }))
    }
    const handleChangeValue = value => {
        // make sure the amount is less than adjust
        let { remaining, numberToAdd } = { ...quantityEdit }
        if (value > remaining) {
            setQuantityEdit(prev => ({ ...prev, numberToAdd: 0 }))
            return toast.error('Cannot add that many')
        } else {
            numberToAdd += value
            remaining -= value
        }
        setQuantityEdit(prev => ({ ...prev, remaining, numberToAdd }))
    }
    return (
        <StyledItemList__Items>
            <div className="item-title">{item.ItemNbr}</div>
            <div className={'centered remaining'}>
                <Typography variant={'subtitle2'}>
                    {quantityEdit.remaining} Remain on PO
                </Typography>
            </div>
            <div className="add-remove">
                {quantityEdit.numberToAdd !== 0 && (
                    <AddRmButton
                        disabled={quantityEdit.numberToAdd === 0}
                        className={
                            quantityEdit.numberToAdd > 0 ? 'add' : 'remove'
                        }
                        variant={'outlined'}
                        size={'small'}
                        onClick={handleAdd}
                    >
                        {quantityEdit.numberToAdd > 0 ? 'Add' : 'Remove'}{' '}
                        {Math.abs(quantityEdit.numberToAdd)}
                    </AddRmButton>
                )}
                <br />
            </div>
            <div className="description">{item.ItemDesc}</div>
            <div className={'centered adjust'}>
                <QuantityHandler
                    canOpen={{
                        challenge: quantityEdit.numberToAdd === 0,
                        message:
                            'Please save or cancel before entering new quantity.',
                    }}
                    quantityEdit={quantityEdit}
                    onCancel={initialize}
                    qty={quantityEdit.numberToAdd + quantityEdit.amtOnUnit}
                    onAdd={addToShipment}
                    onSubtract={removeFromShipment}
                    onChangeValue={handleChangeValue}
                />
            </div>
            <StyledQuan
                className={`centered status ${
                    quantityEdit.amtOnUnit === 0 ? 'none' : 'qty'
                }`}
            >
                <Typography variant={'body2'}>
                    {quantityEdit.amtOnUnit} On This Unit
                </Typography>

                <FormControlLabel
                    control={
                        <Switch
                            checked={addAllSelected}
                            onChange={() => setAddAllSelected(!addAllSelected)}
                            size="small"
                        />
                    }
                    label="Add All"
                />
            </StyledQuan>
            <div className="delete"></div>
        </StyledItemList__Items>
    )
}

export default SingleLineItem
