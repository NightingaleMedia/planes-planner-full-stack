import React from 'react'
import { QuantityHandler, ShippingUnitLineItem } from '..'

import { Typography } from '@material-ui/core'
import {
    AddSubtract,
    StyledItemList__Header,
    StyledItemList__Items,
    StyledTableBody,
} from '../../Styles/LineItem__Styles'

const LoadingLineItem = () => {
    const nothing = () => {
        console.log('loading')
    }
    return (
        <StyledItemList__Items className={'loading'}>
            <div className="item-info">
                <div>
                    <div className="item-title"></div>
                </div>
                <div></div>
            </div>
            <div className={'centered'}>
                <QuantityHandler
                    qty={0}
                    onAdd={nothing}
                    onCancel={nothing}
                    onSubtract={nothing}
                    onChangeValue={nothing}
                    canOpen={{ challenge: false, message: '' }}
                />
            </div>
            <div className={'centered status'}>
                <Typography variant={'body2'}>Loading...</Typography>
            </div>
            <div className={'delete'}></div>
            <div className="description"></div>
            <AddSubtract className={'centered '} style={{ paddingTop: '10px' }}>
                0
            </AddSubtract>
            <div className="adjust"></div>
        </StyledItemList__Items>
    )
}
const LoadingLineItems = props => {
    return (
        <StyledTableBody>
            <StyledItemList__Header>
                <div>Item Information</div>
                <div className={'centered'}>Quantity</div>
                <div className={'centered'}></div>
            </StyledItemList__Header>

            <div>
                {Array.from(Array(3)).map((n, i) => (
                    <LoadingLineItem key={i} />
                ))}
            </div>
        </StyledTableBody>
    )
}

LoadingLineItems.propTypes = {}

export default LoadingLineItems
