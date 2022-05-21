import React from 'react'
import styled from '@emotion/styled'
import { Typography } from '@material-ui/core'
import { PlanLoadShippingUnitDetails } from '.prisma/client'
import { PurchaseOrderDetails } from 'src/types'
// TODO this is still using dummy data
const StyledWrap = styled.div`
    background-color: white;
    margin: 0.5rem auto;
    padding: 1rem;
    display: grid;
    column-gap: 1rem;
    grid-template-columns: 60px 1fr;
    grid-template-rows: 30px auto;
    align-items: center;
    width: 100%;
    border-radius: 6px;
    && .bold {
        font-weight: 800;
    }
    && .qty {
        font-size: 1.5rem;
    }
    && .centered {
        text-align: center;
    }
    @media all and (max-width: 600px) {
        && .desc {
            row-gap: 1rem;
            grid-column: 1/-1;
            font-size: 0.75rem;
        }
        && .qty {
            font-size: 1rem;
        }
    }
`

type SingleShippingUnitItem__Props = {
    item: PlanLoadShippingUnitDetails
    correspondingItem: PurchaseOrderDetails
}
const SingleShippingUnitItem = ({
    item,
    correspondingItem,
}: SingleShippingUnitItem__Props) => {
    return (
        <StyledWrap>
            <div className="centered">
                <Typography variant={'overline'}>QTY</Typography>
            </div>
            <div className="bold">Item #: {item.ItemNbr}</div>
            <div className="bold qty centered">{item.Qty}</div>
            <div className={'desc'}>{correspondingItem.ItemDesc}</div>
        </StyledWrap>
    )
}

SingleShippingUnitItem.propTypes = {}

export default SingleShippingUnitItem
