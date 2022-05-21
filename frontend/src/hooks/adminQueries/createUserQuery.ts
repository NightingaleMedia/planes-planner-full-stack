import { FetchAdmin } from 'lib/auth/FetchAdmin'
import { useState } from 'react'
import { FetchApi } from '../../../lib/fetchApi'

const createUserQuery = (): any => {
    const [creating, setLoading] = useState(false)

    const createUser = async (values) => {
        setLoading(true)

        console.log(values)
        return await FetchAdmin({
            path: '/admin/users',
            options: {
                method: 'POST',
                body: JSON.stringify(values),
            },
        }).then(async (res) => {
            setLoading(false)
            return res
        })
    }

    return { creating, createUser }
}

export default createUserQuery
