import { FetchAdmin } from 'lib/auth/FetchAdmin'
import { useState } from 'react'
import { ApiUser } from 'src/types'

const getVendorQuery = (): any => {
    const [loading, setLoading] = useState(false)
    const [vendor, setVendor] = useState(null)
    const [error, setError] = useState(null)
    const getVendor = async id => {
        setLoading(true)
        return await FetchAdmin({
            path: `/vendor/${id}`,
        })
            .then((res: any) => {
                console.log({ resFetch: res })
                return res
            })
            .catch(err => {
                setError(err)
            })
            .finally(() => setLoading(false))
    }

    return { loading, getVendor, vendor, error }
}

export default getVendorQuery
