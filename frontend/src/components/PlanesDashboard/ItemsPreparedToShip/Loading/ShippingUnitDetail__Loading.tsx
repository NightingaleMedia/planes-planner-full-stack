import { Skeleton, Typography } from '@material-ui/core'
import React from 'react'
import GreyBoxes from 'src/atoms/GreyBoxes'
import {
    StyledAddArea,
    StyledItemList__Header,
    StyledTableBody,
} from '../../Styles/LineItem__Styles'

const ShippingUnitDetail__Loading = () => {
    return (
        <StyledTableBody>
            <StyledItemList__Header>
                <div>Item Information</div>
                <div className={'centered'}>Quantity</div>
                <div className={'centered'}></div>
            </StyledItemList__Header>

            <div>
                {Array.from(Array(4)).map((n, i) => (
                    // <GreyBoxes key={i} number={10} />
                    <Skeleton key={i} height={54} width={148} />
                ))}
            </div>
            <StyledAddArea>
                <GreyBoxes number={2} />
            </StyledAddArea>
        </StyledTableBody>
    )
}

export default ShippingUnitDetail__Loading
