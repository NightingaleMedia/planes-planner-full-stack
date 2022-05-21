import styled from '@emotion/styled'
import { OpenPos } from 'pages/api/purchase-orders/open'
import { useEffect } from 'react'
import GreyBoxes from 'src/atoms/GreyBoxes'
import { getOpenOrders } from 'src/hooks/queries/getOpenOrders'
import Module from '../Module'
import SingleOpenOrder from './SingleOpenOrder'

const Wrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-height: 960px;
    overflow-y: scroll;
`

const OpenOrdersModule = props => {
    const { error, loading, data } = getOpenOrders()

    useEffect(() => {
        if (data) {
            data.orders.sort(
                (a, b) =>
                    Date.parse(String(a?.PurchaseOrderDueDate)) -
                    Date.parse(String(b?.PurchaseOrderDueDate))
            )
        }
    }, [data])
    if (error) {
        console.log(error)
        return (
            <Module title={`${data?.orders?.length || ''} Open Orders`}>
                <Wrap>{error.toString()}</Wrap>
            </Module>
        )
    }
    return (
        <Module
            title={`${data?.orders?.length || ''} Open Orders`}
            subtitle={'Sorted By Date Due'}
        >
            {loading ? (
                <GreyBoxes number={3} />
            ) : (
                <Wrap>
                    {data &&
                        data.orders.map((d, i) => (
                            <SingleOpenOrder
                                key={`${d.PurchaseOrderId}--${i}`}
                                data={d}
                            />
                        ))}
                </Wrap>
            )}
        </Module>
    )
}

OpenOrdersModule.propTypes = {}

export default OpenOrdersModule
