import React from 'react'
import Head from 'next/head'

export type Meta = {
    title: string
}
function Meta({ title }: Meta) {
    return (
        <Head>
            <title>{title}</title>
        </Head>
    )
}

export default Meta
