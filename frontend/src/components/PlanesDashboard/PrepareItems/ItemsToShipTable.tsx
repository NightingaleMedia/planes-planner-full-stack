import React, { useEffect, useState } from 'react'
import { LinearProgress } from '@material-ui/core'
import { dashboardInner } from '../../dashboard/Dashboard__Styles/dashboardInner.theme'
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import { tablesStyle } from '../Styles/Table__Styles'
import useApiQuery from 'src/hooks/useApiQuery'
import Module from '../Module'
import { GetPoDetails__Response } from 'pages/api/purchase-orders/[PurchaseOrderId]/details'
import ErrorModule from '../ErrorModule'

export const ItemsToShipCols: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 0,
        editable: false,
        hide: true,
        hideSortIcons: true,
    },
    {
        field: 'ItemNbr',
        headerName: 'Item #',
        editable: true,
        hideSortIcons: true,
        minWidth: 110,
        disableColumnMenu: true,
    },
    {
        field: 'ItemDesc',
        headerName: 'Description',
        flex: 100,
        hideSortIcons: true,
        minWidth: 400,
        disableColumnMenu: true,
    },
    {
        field: 'ItemQty',
        headerName: 'Total',
        type: 'number',
        headerAlign: 'center',
        align: 'center',
        width: 160,
        editable: true,
        hideSortIcons: true,
        sortable: true,
        disableReorder: true,
        disableColumnMenu: true,
    },
    {
        field: 'FullFilledQty',
        headerName: 'Fullfilled',
        type: 'number',
        headerAlign: 'center',
        align: 'center',
        width: 160,
        editable: true,
        hideSortIcons: true,
        sortable: true,
        disableReorder: true,
        disableColumnMenu: true,
        renderCell: data => (data.value ? data.value : '0'),
    },
    {
        field: 'Another',
        headerName: 'Remaining',
        type: 'number',
        headerAlign: 'center',
        align: 'center',
        width: 160,
        editable: true,
        hideSortIcons: true,
        sortable: true,
        disableReorder: true,
        disableColumnMenu: true,
        valueGetter: params => {
            const total = params.getValue(params.id, 'ItemQty') as number
            const filled = params.getValue(params.id, 'FullFilledQty') as number
            const remain = total - filled
            return `${remain}`
        },
    },
]

type ItemsToShip__Props = {
    purchaseOrderId: string | number
}

type PoDetailQuery = {
    error: boolean
    loading: boolean
    data: GetPoDetails__Response
}

const ItemsToShipTable = ({ purchaseOrderId }: ItemsToShip__Props): any => {
    const classes: any = tablesStyle({ dashboardInner })
    const { error, loading, data }: PoDetailQuery = useApiQuery(
        {
            path: `/purchase-orders/${purchaseOrderId}/details`,
        },
        { refreshInterval: 10 }
    )

    const [rows, setRows] = useState([])

    useEffect(() => {
        if (data) {
            const newRows = data.details.map((d, index) => {
                return { id: index, ...d }
            })
            setRows(newRows)
        }
    }, [data])

    if (error) {
        return <ErrorModule error={error} />
    }
    return (
        <Module
            title={'Items To Ship'}
            subtitle={`${data?.purchaseOrder?.BusinessUnit} ${data?.purchaseOrder?.PurchaseOrderNbr}`}
        >
            {loading ? (
                <LinearProgress />
            ) : (
                data && (
                    <DataGrid
                        // disableColumnSelector
                        className={classes.root}
                        rows={rows}
                        columns={ItemsToShipCols}
                        pageSize={10}
                        rowsPerPageOptions={[]}
                        disableSelectionOnClick
                        sortModel={[{ field: 'ItemNbr', sort: 'asc' }]}
                    />
                )
            )}
        </Module>
    )
}
export default ItemsToShipTable
