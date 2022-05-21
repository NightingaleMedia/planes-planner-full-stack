import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { dashboardInner } from '../dashboard/Dashboard__Styles/dashboardInner.theme'
import { parseParams } from '../../../utils/parseParams'
import {
    DataGrid,
    getGridStringOperators,
    GridCellParams,
    GridColDef,
    GridFilterItem,
    GridToolbar,
} from '@material-ui/data-grid'
import { tablesStyle } from '../PlanesDashboard/Styles/Table__Styles'
import {
    PlanLoadFinder,
    PoDetail__Menu,
    PoStatus,
} from '../PlanesDashboard/PODetail'
import useApiQuery from 'src/hooks/useApiQuery'

import DateParse from '../Assets/DateParse'
import Module from '../PlanesDashboard/Module'
import { AllPoResponse } from 'pages/api/purchase-orders'
import ErrorModule from '../PlanesDashboard/ErrorModule'

import { StatusInputValue } from '../PlanesDashboard/AllOrdersTable/StatusInputComponent'
import { DateInputValue } from '../PlanesDashboard/AllOrdersTable/DateInputComponent'
import Head from 'next/head'
import { Box, Button } from '@material-ui/core'
import { AdminTableToolbar } from './AdminTableToolbar'

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 80,
        editable: false,
        filterable: false,
        hide: true,
        hideSortIcons: true,
    },
    {
        field: 'BusinessUnit',
        headerName: 'Bus Unit',
        headerAlign: 'center',
        align: 'center',
        editable: true,
        hideSortIcons: true,
        minWidth: 80,
        disableColumnMenu: true,
        filterOperators: getGridStringOperators().filter(
            o =>
                !['isEmpty', 'isNotEmpty', 'startsWith', 'endsWith'].includes(
                    o.value
                )
        ),
    },
    {
        field: 'PurchaseOrderNbr',
        headerName: 'PO #',
        hideSortIcons: true,
        filterOperators: getGridStringOperators().filter(
            o => o.value === 'equals' || o.value === 'contains'
        ),
        minWidth: 150,
        disableColumnMenu: false,
    },
    {
        field: 'POStatus',
        headerName: 'Status',
        type: 'text',
        headerAlign: 'center',
        align: 'center',
        width: 180,
        editable: false,
        filterable: true,
        disableColumnMenu: false,

        filterOperators: [
            {
                label: 'is',
                value: 'Is',
                InputComponent: StatusInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: GridCellParams): boolean => {
                        return params.value === filterItem.value
                    }
                },
            },
        ],
        hideSortIcons: false,
        renderCell: data => {
            console.log({ data })
            return (
                <PoStatus
                    purchaseOrderId={data.row.PurchaseOrderId}
                    planLoadId={data.row.PlanLoadId}
                />
            )
        },
    },
    {
        field: 'VendorId',
        headerName: 'Vendor Id',
        type: 'text',
        align: 'center',
        headerAlign: 'center',
        width: 120,
        editable: false,
        hideSortIcons: true,
        filterable: true,
        sortable: true,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
        filterOperators: getGridStringOperators().filter(
            o =>
                !['isEmpty', 'isNotEmpty', 'startsWith', 'endsWith'].includes(
                    o.value
                )
        ),
    },
    {
        field: 'StoreNbr',
        headerName: 'Store #',
        type: 'text',
        headerAlign: 'left',
        width: 120,
        editable: true,
        hideSortIcons: false,
        filterable: false,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
    },
    {
        field: 'VendorName',
        headerName: 'Vendor Name',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        filterable: false,
        disableColumnMenu: true,
        width: 160,
        hide: true,
    },
    {
        field: 'poIssueDate',
        headerName: 'Issue Date',
        width: 130,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
        hide: true,
    },
    {
        field: 'poShipDate',
        headerName: 'Ship Date',
        width: 120,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
        renderCell: data => <DateParse>{data.value}</DateParse>,
    },
    {
        field: 'PurchaseOrderDueDate',
        headerName: 'Due Date',
        width: 120,
        filterable: true,
        editable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        filterOperators: [
            {
                label: 'After',
                value: 'after',
                InputComponent: DateInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }
                    return (params: any): boolean => {
                        const dateToFilter = Date.parse(filterItem.value)
                        const dateOfRow = Date.parse(params.value)
                        return dateToFilter < dateOfRow
                    }
                },
            },
            {
                label: 'Before',
                value: 'before',
                InputComponent: DateInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: any): boolean => {
                        const dateToFilter = Date.parse(filterItem.value)
                        const dateOfRow = Date.parse(params.value)

                        return dateToFilter > dateOfRow
                    }
                },
            },
            {
                label: 'Equals',
                value: 'equals',
                InputComponent: DateInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: any): boolean => {
                        const dateToFilter = Date.parse(filterItem.value)
                        const dateOfRow = Date.parse(params.value)
                        console.log({ dateToFilter, dateOfRow })
                        return dateToFilter == dateOfRow
                    }
                },
            },
        ],
        renderCell: data => <DateParse>{data.value}</DateParse>,
    },
    {
        field: 'poShipTo',
        headerName: 'PO Ship To',
        type: 'text',
        headerAlign: 'left',
        width: 180,
        editable: false,
        hideSortIcons: true,
        hide: true,
        filterable: false,
    },
    {
        field: 'PurchaseOrderReference',
        headerName: 'PO Reference',
        type: 'text',
        headerAlign: 'left',
        width: 180,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
        hideSortIcons: true,
        hide: true,
    },
    {
        field: 'planLoadId',
        headerName: 'Plan Load',
        type: 'text',
        align: 'left',
        headerAlign: 'left',
        filterable: false,
        width: 200,
        editable: false,
        disableColumnMenu: true,
        hideSortIcons: false,
        renderCell: data => (
            <PlanLoadFinder
                purchaseOrderId={data.row.PurchaseOrderId}
                index={data.row.PurchaseOrderIndex}
            />
        ),
    },
    {
        field: 'contextMenu',
        headerName: 'Action',
        width: 120,
        editable: false,
        filterable: false,
        disableColumnMenu: true,
        hideSortIcons: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: data => <PoDetail__Menu data={data.row} info={data} />,
    },
]

type AllOrder__Response = {
    error: boolean
    loading: boolean
    data: AllPoResponse
    mutate: (url: string) => any
}

const AllOrdersAdminTable = () => {
    const router = useRouter()

    const classes: any = tablesStyle({ dashboardInner })
    const [rows, setRows] = useState([])

    const [selectedCellData, setSelectedCellData] = useState(null)

    const [paginate, setPaginate] = useState({
        start: 0,
        count: 20,
    })

    const [paramsToFetch, setParamsToFetch] = useState(
        `start=${paginate.start}&count=${paginate.count}`
    )

    const { error, loading, data, mutate }: AllOrder__Response = useApiQuery({
        path: `/admin/orders?${paramsToFetch}`,
    })

    useEffect(() => {
        console.log({ paramsToFetch })
        mutate(`/admin/orders?${paramsToFetch}`)
    }, [paramsToFetch])

    // transform data
    useEffect(() => {
        console.log('new data ====>')
        if (data) {
            const newRows = data.orders.map((d, index) => {
                return { id: index, ...d }
            })
            setRows(newRows)
        }
    }, [data])

    useEffect(() => {
        const oldParams = parseParams(paramsToFetch)

        delete oldParams.start
        delete oldParams.count

        updateSearchParams(oldParams)
    }, [paginate])

    const handlePoOpen = selected => {
        router.push({
            pathname: `/orders/${selected.PurchaseOrderId}`,
        })
    }
    if (error) {
        return <ErrorModule error={error} />
    }

    function updateSearchParams(obj) {
        const usp = new URLSearchParams(obj)

        usp.append('start', paginate.start.toString())
        usp.append('count', paginate.count.toString())
        usp.sort()
        const qs = usp.toString()
        setParamsToFetch(qs)
    }

    const onFilterChange = useCallback(filterModel => {
        const operator = filterModel.items[0]

        if (operator?.value) {
            // Create a stable key for SWR
            updateSearchParams(operator)
        }
    }, [])

    return (
        <Module
            title={'All Purchase Orders'}
            subtitle={<Box sx={{ py: 2 }}></Box>}
        >
            <Head>
                <title>Planes | Super Admin</title>
            </Head>

            <div style={{ height: '1300px' }}>
                <DataGrid
                    loading={loading || !data}
                    rows={rows}
                    columns={columns}
                    paginationMode="server"
                    filterMode="server"
                    onFilterModelChange={onFilterChange}
                    components={{
                        Toolbar: () => (
                            <AdminTableToolbar
                                clearFilter={() => {
                                    updateSearchParams({})
                                }}
                            />
                        ),
                    }}
                    onRowDoubleClick={data => {
                        setSelectedCellData(data.row)
                        handlePoOpen(data.row)
                    }}
                    getRowClassName={params => {
                        const v = params.getValue(
                            params.id,
                            'PurchaseOrderIndex'
                        )
                        return `index--${v}`
                    }}
                    rowCount={data?.metadata?.total}
                    className={classes.root}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    page={paginate.start / 20}
                    onPageChange={page => {
                        if (page == 0) {
                            setPaginate(prev => ({
                                ...prev,
                                start: 0,
                            }))
                        } else {
                            setPaginate(prev => ({
                                ...prev,
                                start: 20 * page,
                            }))
                        }
                    }}
                />
            </div>
        </Module>
    )
}
export default AllOrdersAdminTable
