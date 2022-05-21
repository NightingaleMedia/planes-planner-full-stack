import { PurchaseOrders } from '@prisma/client'
import withUser from 'lib/withUser'
import { NextApiResponse } from 'next'
import { NextApiRequest__User } from 'src/types'
import prisma from '../../../lib/db/prisma/index'
type MetaQuery = {
    total: number
}

type AdminTableQueries = {
    query: {
        columnField?:
            | 'BusinessUnit'
            | 'POStatus'
            | 'PurchaseOrderNbr'
            | 'PurchaseOrderDueDate'
            | 'VendorId'

        operatorValue?: string
        value?: string
    }
}

const columnFieldOptions = value => ({
    POStatus: { Is: `po.POStatus = '${value}'` },
    BusinessUnit: {
        contains: `po.BusinessUnit like '%${value}%'`,
        equals: `po.BusinessUnit = '${value}'`,
    },
    PurchaseOrderNbr: {
        equals: `po.PurchaseOrderId = '${value}'`,
        contains: `po.PurchaseOrderId like '%${value}%'`,
    },
    PurchaseOrderDueDate: {
        before: 'before',
        after: 'after',
        equals: 'equals',
    },
    VendorId: {
        contains: `po.VendorId like '%${value}%'`,
        equals: `po.VendorId = '${value}'`,
    },
})

function calculateQuery(
    columnField,
    keyToSearch: string,
    operatorValue,
    value
) {
    if (columnField !== keyToSearch) {
        console.log('No columnField: ' + keyToSearch)
        return ''
    } else {
        let statement = columnFieldOptions(value) as any
        statement = `${statement[keyToSearch][operatorValue]}`
        console.log({ statement })
        return 'and ' + statement
    }
}

const superAdminOrders = async (
    req: NextApiRequest__User,
    res: NextApiResponse
) => {
    if (req.user.role !== 'SUPERADMIN') {
        return res.status(401).json({ message: 'unauthorized' })
    }

    let { start, count } = req.query as { start: string; count: string }
    if (!start) start = '0'
    if (!count) count = '10'

    const {
        query: { columnField, operatorValue, value },
    } = req as AdminTableQueries

    if (Number(count) > 100) {
        return res
            .status(400)
            .json({ message: `Count ${count} exceeds limit of 100.` })
    }
    console.log('query: ', req.query)

    const metaQuery = await prisma.$queryRaw<MetaQuery[]>(`
    select COUNT(po.PurchaseOrderId) as total
        from PurchaseOrders po
    left join PlanLoads pl
        on pl.PurchaseOrderId = po.PurchaseOrderId
    where po.PurchaseOrderId is not null
    ${calculateQuery(columnField, 'VendorId', operatorValue, value)}
    ${calculateQuery(columnField, 'BusinessUnit', operatorValue, value)}
    ${calculateQuery(columnField, 'PurchaseOrderNbr', operatorValue, value)}
    ${calculateQuery(columnField, 'POStatus', operatorValue, value)}

`)
    if (metaQuery[0].total < Number(start)) {
        start = '0'
        metaQuery[0].total === 0
            ? (count = '1')
            : (count = `${metaQuery[0].total}`)
    }

    const superAdminResult = await prisma.$queryRaw<PurchaseOrders[]>(`
        select po.*, pl.LoadName, pl.PlanLoadId, pl.PurchaseOrderIndex
        from PurchaseOrders po
        left join PlanLoads pl
        on pl.PurchaseOrderId = po.PurchaseOrderId
        where po.PurchaseOrderId is not null
            ${calculateQuery(columnField, 'VendorId', operatorValue, value)}
            ${calculateQuery(columnField, 'BusinessUnit', operatorValue, value)}
            ${calculateQuery(
                columnField,
                'PurchaseOrderNbr',
                operatorValue,
                value
            )}
            ${calculateQuery(columnField, 'POStatus', operatorValue, value)}
        order by PurchaseOrderId
        offset ${start} rows
        fetch next ${count} rows only
    `)

    return res.json({
        metadata: {
            total: metaQuery[0].total,
            start: Number(start),
            end: Number(start) + Number(count),
            count: Number(count),
        },
        orders: superAdminResult,
    })
}

export default withUser(superAdminOrders)
