import React from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Link from 'next/link'
import AlertCard from '../AlertCard'
import { Button, Alert, Box, AlertTitle } from '@material-ui/core'
import { Loads } from 'pages/api/purchase-orders/[PurchaseOrderId]'
const StyledButton = styled(Button)`
    &&.selected {
        outline: 3px solid ${props => props.theme.palette.primary.main};
    }
`
const ShortShipAlert = ({ Loads }: { Loads: Loads[] }) => {
    const router = useRouter()

    console.log(router.query.index)
    console.log(Loads)
    if (Loads.length === 1) {
        return <></>
    }

    return (
        <Alert
            severity="warning"
            title={'This Purchase Order has Multiple Plan Loads'}
        >
            <AlertTitle>
                This purchase order has been short shipped. Please load this
                order separately here:
            </AlertTitle>
            <div
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexFlow: 'wrap',
                }}
            >
                {Loads.map(i => (
                    <Link
                        key={i.PlanLoadId}
                        href={{
                            query: {
                                purchaseOrderId: i.PurchaseOrderId,
                                index: i.PurchaseOrderIndex,
                            },
                        }}
                    >
                        <Box
                            style={{
                                marginRight: '10px',
                                marginBottom: '10px',
                                textAlign: 'left',
                                backgroundColor: 'grey',
                            }}
                        >
                            <StyledButton
                                className={
                                    Number(router.query.index) ==
                                    i.PurchaseOrderIndex
                                        ? 'selected'
                                        : ''
                                }
                                title={i.LoadName}
                                variant={'contained'}
                                color="primary"
                            >
                                {i.LoadName.slice(0, 20)}... <br /> ID:{' '}
                                {i.PlanLoadId}
                            </StyledButton>
                        </Box>
                    </Link>
                ))}
            </div>
        </Alert>
    )
}

export default ShortShipAlert
