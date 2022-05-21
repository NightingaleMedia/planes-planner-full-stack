import { useEffect, useState } from 'react'
import { FetchApi, FetchObj } from '../../lib/fetchApi'
import useSWR, { useSWRConfig } from 'swr'

const useApiQuery = (obj: FetchObj, options?: any): any => {
    const { error, data } = useSWR(obj.path, () => FetchApi(obj), {
        ...options,
    })

    const swr = useSWRConfig()
    const mutate = () => swr.mutate(obj.path)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!data) {
            setLoading(true)
        }
        if (data && !error) {
            setLoading(false)
        }
        if (error) {
            setLoading(false)
            console.log('Use API query error: ', error)
        }
    }, [data, error])

    return { error, loading, data, mutate }
}

export default useApiQuery
