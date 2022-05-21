import { useEffect, useState } from 'react'
import { FetchApi, FetchObj } from 'lib/fetchApi'
import { useSWRConfig } from 'swr'
import { POStatuses } from 'src/constants'

export const changePoStatusQuery = (
    purchaseOrderId: number,
    planLoadId: number
): any => {
    const { mutate } = useSWRConfig()
    const [changing, setLoading] = useState(false)

    const changeStatus = async (newStatus: POStatuses) => {
        setLoading(true)

        return await FetchApi({
            path: `/purchase-orders/${purchaseOrderId}/change-status`,

            options: {
                method: 'POST',
                body: JSON.stringify({
                    status: newStatus,
                    planLoadId,
                }),
            },
        }).then(res => {
            mutate(`/purchase-orders/${purchaseOrderId}/`)
            mutate('/purchase-orders')
            setLoading(false)
            return res
        })
    }

    return { changing, changeStatus }
}

export default changePoStatusQuery
