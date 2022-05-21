import { SHIPPING_SELECT } from '..'
import prisma from '../../../../lib/db/prisma/index'

export const createShippingUnit = async data => {
    const reqFields = [
        'PlanLoadId',
        'Length',
        'Width',
        'Height',
        'DimUnits',
        'Weight',
        'WeightUnits',
    ]
    // loop thru the required fields and make sure there is a
    // relevant entry for each one
    const result = reqFields.reduce((arr: any[], field: string): any => {
        if (!data[field]) {
            arr.push(field)
        }
        return arr
    }, [])
    if (result.length > 0) {
        throw { status: 400, message: `Missing fields: ${[result]}` }
    }
    try {
        const suCreate = await prisma.planLoadShippingUnits.create({
            data,
            select: { ...SHIPPING_SELECT },
        })
        console.log({ data })
        return { status: 201, message: 'Created!', shippingUnit: suCreate }
    } catch (error) {
        throw { status: 400, message: error.toString() }
    }
}
