import { useEffect, useState } from 'react'
import { FetchApi, FetchObj } from '../../lib/fetchApi'
import { FetchAdmin } from '../../lib/auth/FetchAdmin'
import useSWR from 'swr'
const useAdminQuery = (obj: FetchObj, options?: any): any => {
    const { error, data, mutate } = useSWR(obj.path, () => FetchAdmin(obj), {
        ...options,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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

export default useAdminQuery
