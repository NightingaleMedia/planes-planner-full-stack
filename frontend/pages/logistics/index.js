import React from 'react'
import { useRouter } from 'next/router'
import Module from '../../src/components/PlanesDashboard/Module'
const Logistics = () => {
    const router = useRouter()

    console.log({ query: router.query })
    return (
        <div>
            <Module
                title={'Logistics'}
                subtitle={'This feature is still in development'}
            />
        </div>
    )
}

export default Logistics
