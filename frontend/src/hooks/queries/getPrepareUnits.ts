import { useEffect, useState } from 'react'
import { FetchApi, FetchObj } from 'lib/fetchApi'
import useSWR from 'swr'
import { APIError } from 'src/types/APIError'
import { PlanLoadResponse } from 'pages/api/plan-loads'

type PlanLoadQuery = {
    error?: null | APIError
    data?: PlanLoadResponse | null
    mutate?: any
    loading: boolean
}
export const getPreparedUnits = (
    PlanLoadId: number | string
): PlanLoadQuery => {
    const { error, data, mutate } = useSWR<any>(
        `/plan-loads/${PlanLoadId}`,
        () =>
            FetchApi({
                path: `/plan-loads/${PlanLoadId}`,
            }),
        {
            onErrorRetry: () => {
                return
            },
        }
    )

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (data) {
            setLoading(false)
        }
        if (error) {
            setLoading(false)
            console.log('getPlanLoadByPo error: ', error)
        }
    }, [data, error])

    return { error, loading, data, mutate }
}
