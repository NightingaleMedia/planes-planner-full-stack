import React, { useMemo } from 'react'
import { QuantityHandler } from '.'
import { IconButton, Typography } from '@material-ui/core'
import { DeleteForeverOutlined } from '@material-ui/icons'
import { PurchaseOrderDetails } from '.prisma/client'
import { AddSubtract, StyledItemList__Items } from '../Styles/LineItem__Styles'

export const classx = v => {
    let classMap = 'zero'
    if (v > 0) {
        classMap = 'add'
    }
    if (v < 0) {
        classMap = 'subtract'
    }
    return classMap
}

type ShippingUnitLineItem__Props = {
    item: any
    correspondingPoDetails: PurchaseOrderDetails[]
    onValueChange: (amt: number, shouldSave?: boolean) => void
    onDelete: (id: number) => void
    onCancel: () => void
    submitCallback: () => void
    loading?: boolean
    changesStaged: boolean
}

const ShippingUnitLineItem = ({
    item,
    correspondingPoDetails,
    onValueChange,
    onDelete,
    onCancel,
    submitCallback,
    loading,
    changesStaged,
}: ShippingUnitLineItem__Props): any => {
    const { itemQty, itemRemaining, quantityToAdd } = item

    const initItemQty = useMemo(() => itemQty, [item])
    return (
        <StyledItemList__Items className={loading && 'loading'}>
            <div className="item-title">{item.ItemNbr}</div>

            <div className={'centered adjust'}>
                <QuantityHandler
                    canOpen={{
                        challenge: !changesStaged,
                        message: 'Please save or cancel changes before editing',
                    }}
                    quantityEdit={{
                        amtOnUnit: initItemQty,
                        numberToAdd: quantityToAdd,
                        remaining: itemRemaining,
                    }}
                    qty={itemQty}
                    onAdd={() => onValueChange(1)}
                    onSubtract={() => {
                        onValueChange(-1)
                    }}
                    onChangeValue={value => {
                        onValueChange(Number(value), true)
                    }}
                    onCancel={onCancel}
                />
            </div>
            <div className={'centered remaining'}>
                <Typography variant={'body2'}>
                    {itemRemaining} Remaining on PO
                </Typography>
            </div>
            <div className={'delete'}>
                <IconButton onClick={() => onDelete(item.ItemNbr)}>
                    <DeleteForeverOutlined />
                </IconButton>
            </div>
            <div className="description">
                {
                    correspondingPoDetails.filter(
                        i => i.ItemNbr === item.ItemNbr
                    )[0]?.ItemDesc
                }
            </div>
            <AddSubtract
                className={`centered quantity-to-add ${classx(quantityToAdd)}`}
                style={{ paddingTop: '10px' }}
            >
                {quantityToAdd}
            </AddSubtract>
            <div className="adjust"></div>
        </StyledItemList__Items>
    )
}

ShippingUnitLineItem.propTypes = {}

export default ShippingUnitLineItem
