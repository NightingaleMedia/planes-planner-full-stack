import { FetchObj } from 'lib/fetchApi'
import { merge } from 'lodash'

export const getUrl = () => {
    return process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4444'
}

export async function FetchAdmin({
    path,
    headers,
    options,
}: FetchObj): Promise<JSON> {
    const token = localStorage.getItem(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME
    )

    const defaultHeaders = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...headers,
        },
    }

    const pathToCall = getUrl() + path
    const res = await fetch(pathToCall, merge(defaultHeaders, options))
    const result = await res.json()
    if (!res.ok) {
        console.log('Admin API error: ', result.message)
        throw result
    } else {
        return result
    }
}
