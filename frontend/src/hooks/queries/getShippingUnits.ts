import { useEffect, useState } from 'react'
import { FetchApi, FetchObj } from '../../../lib/fetchApi'
import useSWR from 'swr'
const getShippingUnits = (obj: FetchObj): any => {
    const { error, data } = useSWR(obj.path, () => FetchApi(obj))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (data && !error) {
            setLoading(false)
        }
        if(error){
            setLoading(false)
            console.log('use api query error: ', error)
        }
    }, [data, error])

    return { error, loading, data }
}

export default getShippingUnits
