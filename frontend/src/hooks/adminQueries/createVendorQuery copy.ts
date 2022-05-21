
import { FetchAdmin } from 'lib/auth/FetchAdmin'
import { useState } from 'react'
import { FetchApi } from '../../../lib/fetchApi'

const createVendorQuery = (): any => {
    const [creating, setLoading] = useState(false)

    const createVendor = async (values) => {
        setLoading(true)

        console.log(values)
        return await FetchAdmin({
            path: '/vendor',
            options: {
                method: 'POST',
                body: JSON.stringify(values),
            },
        }).then(async (res) => {
            setLoading(false)
            return res
        })
    }

    return { creating, createVendor }
}

export default createVendorQuery
