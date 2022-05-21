import { merge } from 'lodash'

export const getUrl = () => {
    return process.env.API_URL || '/api'
}

export type FetchObj = {
    path: string
    headers?: Headers | any
    options?: any
}

export async function FetchApi({
    path,
    headers,
    options,
}: FetchObj): Promise<JSON> {
    const accessToken = localStorage.getItem(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME
    )

    const defaultHeaders = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            ...headers,
        },
    }

    const pathToCall = getUrl() + path

    const res = await fetch(pathToCall, merge(defaultHeaders, options))

    if (!res.ok) {
        const error = await res.json()
        console.log('Fetch Api error: ', error)
        throw error
    } else {
        return await res.json()
    }
}
