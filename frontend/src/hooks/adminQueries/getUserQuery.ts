import { FetchAdmin } from 'lib/auth/FetchAdmin'
import { useState } from 'react'

const getUserQuery = (): any => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const getUser = async id => {
        setLoading(true)
        return await FetchAdmin({
            path: `/user/${id}`,
        })
            .then((res: any) => {
                console.log({ userFetch: res })
                setUser(res.user)
                return res.user
            })
            .catch(err => {
                setError(err)
            })
            .finally(() => setLoading(false))
    }

    return { loading, getUser, user, error }
}

export default getUserQuery
