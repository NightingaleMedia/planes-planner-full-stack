import React from 'react'
import SingleShippingUnit from './SingleShippingUnit'
import styled from '@emotion/styled'
import { LinearProgress, Paper, Typography } from '@material-ui/core'
import { getPlanLoadByPo } from 'src/hooks/queries'
import AlertCard from '../AlertCard'

const StyledWrap = styled(Paper)`
    padding: 1rem;
    margin: 1rem 0;
`

const Header = styled.div`
    margin: 1rem 0;
`
const ShippingUnitMap = ({
    purchaseOrderId,
    index,
}: {
    purchaseOrderId: string | number
    index: string | number | any
}) => {
    // TODO index needs to be handled
    const { error, loading, data } = getPlanLoadByPo(purchaseOrderId, index)

    if (loading) {
        return <LinearProgress />
    }
    if (error) {
        console.log({ error })
        return (
            <AlertCard title={'Something Went Wrong'}>
                {error.message}
            </AlertCard>
        )
    }
    // TODO handle loading

    return (
        <StyledWrap>
            <Header>
                <Typography variant={'h3'}>
                    {data?.planLoad?.LoadName}
                </Typography>
                <div>
                    <Typography variant={'overline'}>
                        {data?.planLoad?.BusinessUnit}{' '}
                        {data?.planLoad?.PurchaseOrderNbr}
                    </Typography>
                </div>
            </Header>
            {data?.planLoadShippingUnits.length > 0 &&
                data?.planLoadShippingUnits.map(d => (
                    <div
                        key={d.PlanLoadShippingUnitId}
                        style={{ marginBottom: '0.5rem' }}
                    >
                        <SingleShippingUnit
                            data={d}
                            correspondingDetails={data.correspondingPoDetails}
                        />
                    </div>
                ))}
        </StyledWrap>
    )
}

ShippingUnitMap.propTypes = {}

export default ShippingUnitMap
