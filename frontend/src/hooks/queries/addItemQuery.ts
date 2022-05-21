import { AddItemsReq } from 'pages/api/shipping-units/add-items'
import { useState } from 'react'
import { FetchApi } from '../../../lib/fetchApi'

const addItemQuery = (): any => {
    const [adding, setLoading] = useState(false)

    const addItems = async (items: AddItemsReq, shippingUnitId) => {
        setLoading(true)
        return await FetchApi({
            path: '/shipping-units/add-items',
            options: {
                method: 'POST',
                body: JSON.stringify({
                    items,
                    shippingUnitId: shippingUnitId,
                }),
            },
        }).then(async res => {
            setLoading(false)
            return res
        })
    }

    return { adding, addItems }
}

export default addItemQuery
