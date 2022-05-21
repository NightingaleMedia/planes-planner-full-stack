import { useState } from 'react'
import { FetchApi } from '../../../lib/fetchApi'

export const changePoStatusQuery = (): any => {
    const [deletingItem, setLoading] = useState(false)

    const deleteItem = async (
        planLoadShippingUnitId: number,
        itemNbr: string
    ) => {
        setLoading(true)
        return await FetchApi({
            path: '/shipping-units/remove-items',
            options: {
                method: 'DELETE',
                body: JSON.stringify({
                    planLoadShippingUnitId,
                    itemNbr,
                }),
            },
        })
            .then((res) => {
                setLoading(false)
                console.log(res)
                return res
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                throw { message: 'Sorry, something went wrong' }
            })
    }

    return { deletingItem, deleteItem }
}
export default changePoStatusQuery
