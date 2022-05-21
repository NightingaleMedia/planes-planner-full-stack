import { useState } from 'react'
import { FetchApi } from '../../../lib/fetchApi'
import { useSWRConfig } from 'swr'
const createShippingUnitQuery = (): any => {
    const { mutate } = useSWRConfig()

    const [creating, setLoading] = useState(false)

    const createUnit = async (data) => {
        setLoading(true)

        return await FetchApi({
            path: '/shipping-units',
            options: {
                method: 'POST',
                body: JSON.stringify(data),
            },
        })
            .catch((err) => {
                console.log('err from query: ', err)
                throw err
            })
            .then((res) => {
                console.log({ query: res })
                return res
            })
            .finally(() => {
                mutate('/shipping-units')
                setLoading(false)
            })
    }

    return { creating, createUnit }
}

export default createShippingUnitQuery
