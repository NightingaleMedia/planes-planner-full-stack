import { useEffect, useState } from 'react'
import { FetchApi, FetchObj } from 'lib/fetchApi'
import useSWR from 'swr'
import { APIError } from 'src/types/APIError'
import { PlanLoadResponse } from 'pages/api/plan-loads'
import { Metadata__Response } from 'pages/api/purchase-orders'
import { PurchaseOrders } from '@prisma/client'
import { OpenPos } from 'pages/api/purchase-orders/open'

type OpenOrderQuery = {
    error?: null | APIError
    data?: {
        orders: OpenPos[] | null
        metadata: Metadata__Response
    }
    mutate?: any
    loading: boolean
}

export const getOpenOrders = (): OpenOrderQuery => {
    const { error, data, mutate } = useSWR<any>(
        '/purchase-orders/open',
        () =>
            FetchApi({
                path: '/purchase-orders/open',
            }),
        {
            onErrorRetry: () => {
                return
            },
        }
    )

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (data || error) {
            setLoading(false)
        }
    }, [data, error])

    return { error, loading, data, mutate }
}
