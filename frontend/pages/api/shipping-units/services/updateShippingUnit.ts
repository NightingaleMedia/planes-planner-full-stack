import prisma from '../../../../lib/db/prisma/index'
import { PACKAGE_TYPES } from 'src/constants'
import { SHIPPING_SELECT } from '..'

export const updateShippingUnit = async (id, values) => {
    if (values) {
        // sanitize packaging
        if (values.Packaging) {
            values.Packaging = values.Packaging.toUpperCase()
            if (!(values.Packaging in PACKAGE_TYPES)) {
                throw 'Invalid package type'
            }
            PACKAGE_TYPES[values.Packaging]
        }
        const updated = await prisma.planLoadShippingUnits.update({
            where: {
                PlanLoadShippingUnitId: id,
            },
            data: { ...values },
            select: { ...SHIPPING_SELECT },
        })
        return updated
    } else {
        throw { status: 400, message: 'No values to update' }
    }
}
